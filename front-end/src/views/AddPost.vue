<template>
<div class="addPage">
    <h1>Blog Post</h1>
    <div id="users">
        <button :style="{backgroundColor: user.color}"
        :class="{ white: darkColor(user.color), selected: active(user)}"
        v-for="user in users" :key=user.id
        @click=selectUser(user)>{{user.name}}</button>
    </div>
    <p>This is the page to add blog posts and new users.</p>
    <div class="addUser">
        <form @submit.prevent="addUser">
          <input type="text" v-model="userName">
          <swatchPicker v-model="color"/>
          <button type="submit">Add a User</button>
        </form>
    </div>
    <div class="add">
        <div class="form">
            <input v-model="title" placeholder="Title of the blog post" @change="postChanged">
            <p></p>
            <input v-model="date" placeholder="Date of the blog post" @change="postChanged">
            <p></p>
            <input v-model="time" placeholder="Time of the blog post" @change="postChanged">
            <p></p>
            <input type="file" name="photo" @change="fileChanged">
            <p></p>
            <button @click="upload">Upload</button>
            <p></p>
            <textarea class = "post" name="Post" v-model="post"
            placeholder="Type the blog post here" @change="postChanged"> </textarea>

        </div>
    </div>
    <div class="submitted" v-if="beenPosted">
        <h2>Congrats! We posted your post</h2>
    </div>

</div>
</template>

<script>
    import axios from 'axios';
    import { Swatches } from 'vue-color'
    export default {
        name: 'AddPost',
        data() {
            return {
                title: "",
                post: "",
                userName: "",
                file: null,
                items: [],
                date: "",
                time: "",
                color: "#000",
                beenPosted: false,
                users: [],
                user: null,
            }
        },
        components: {
            'swatchPicker': Swatches,
        },
        computed: {

        },
        created() {
            this.getUsers();
            this.getItems();
        },
        methods: {
            fileChanged(event) {
              this.file = event.target.files[0]
              this.postChanged(event);
            },
            postChanged(event) {
                if (this.beenPosted) {
                    this.beenPosted = false;
                    event;
                }
            },
            async getItems() {
              try {
                  let response = await axios.get("/api/items");
                  this.posts = response.data;
                  return true;
              } catch (error) {
                  console.log(error);
              }
            },
            active(user) {
              return (this.user && user._id === this.user._id);
            },
            async upload() {
                try {
                    const formData = new FormData();
                    formData.append('photo', this.file, this.file.name);
                    let r1 = await axios.post('/api/photos', formData);
                    console.log("Made past photot");
                    await axios.post('/api/items', {
                        title: this.title,
                        paragraphs: [this.post],
                        date: this.date,
                        time: this.time,
                        path: r1.data.path,
                    });
                    this.getItems();
                    this.title = '';
                    this.post = '';
                    this.date = '';
                    this.time = '';
                    this.beenPosted = true;
                } catch (error) {
                    console.log(error);
                }
            },
            async addUser() {
                try {
                    await axios.post('/api/users', {
                        name: this.userName,
                        color: this.color.hex,
                    });
                    await this.getUsers();
                } catch (error) {
                    console.log(error);
                }
            },
            async getUsers() {
                try {
                  const response = await axios.get('/api/users');
                  this.users = response.data;
                  if (!this.user && this.users.length > 0) {
                    this.user = this.users[0];
                  }
                } catch (error) {
                    console.log(error);
                }
            },
            selectUser(user) {
                this.user = user;
                this.getUsers();
            },
            darkColor(color) {
              return (this.lightOrDark(color) === 'dark');
            },

            lightOrDark(color) {
              let hex = color;
              if (typeof color === 'object' && color !== null)
                hex = color.hex;

                // Convert it to RGB: http://gist.github.com/983661
              let rgb = +("0x" + hex.slice(1).replace(
              hex.length < 5 && /./g, '$&$&'));

              const r = rgb >> 16;
              const g = rgb >> 8 & 255;
              const b = rgb & 255;

              // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
              const hsp = Math.sqrt(
              0.299 * (r * r) +
              0.587 * (g * g) +
              0.114 * (b * b)
              );

              // Using the HSP value, determine whether the color is light or dark
              if (hsp>127.5) {

                  return 'light';
              }
              else {

                  return 'dark';
              }
            },
        },

    }
</script>

<style scoped>
.addUser,
.addUser input,
.addUser form,
.addUser button,
swatchPicker {
    margin: 10px;
}
form {
    margin-top: 50px;
}
#users {
    margin: 10px;
}

.vc-swatches {
  margin-bottom: 20px;
}

.white {
  color: #fff;
}
</style>
