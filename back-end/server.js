
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  color: String,
});

userSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

userSchema.set('toJSON', {
  virtuals: true
});

const User = mongoose.model("User", userSchema);

app.post('/api/users', async (req, res) => {
  const user = new User({
    name: req.body.name,
    color: req.body.color,
  });
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/users/:userID', async (req, res) => {
  try {
    let user = await User.findOne({_id: req.params.userID});
    if (!item) {
      res.status(404).send({
        message: "Couldn't find user to update",
      });
      return;
    }
    user.name = req.body.name;
    user.color = req.body.color;
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.delete('/api/users/:userID', async (req, res) => {
  try {
    let user = await User.findOne({_id: req.params.userID});
    if (!user) {
      res.status(404).send({
        message: "Couldn't find user to delete",
      });
      return;
    }
    await user.delete();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
})

const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  title: String,
  paragraphs: [String],
  date: String,
  time: String,
  path: String,
});

itemSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

itemSchema.set('toJSON', {
  virtuals: true
});
// Create a model for blog posts
const Item = mongoose.model('Item', itemSchema);

app.post('/api/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

app.post('/api/users/:userID/items', async (req, res) => {
  try {
    let user = await User.findOne({_id: req.params.userID});
    if (!user) {
      res.send(404);
      return;
    }
    const item = new Item({
      user: user,
      title: req.body.title,
      paragraphs: req.body.paragraphs,
      date: req.body.date,
      time: req.body.time,
      path: req.body.path,
    });
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find().populate('user');
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id,
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    let item = await Item.findOne({
      _id: req.params.id,
    });
    item.title = req.body.title;
    item.paragraphs = req.body.paragraphs;
    item.date = req.body.date;
    item.time = req.body.time;
    await item.save();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(3002, () => console.log('Server listening on port 3002!'));
