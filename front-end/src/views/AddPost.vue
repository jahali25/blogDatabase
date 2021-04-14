<template>
<div class="addPage">
    <h1>Blog Post</h1>
    <UsersDisplay />
    <p>This is the page to add blog posts and new users.</p>
    <div class="addUser">
        <form @submit.prevent="addUser">
          <input type="text" v-model="userName">
          <div class="swatchWrapper">
            <swatchPicker v-model="color"/>
          </div>
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
    import { Swatches } from 'vue-color';
    import UsersDisplay from '@/components/UsersDisplay.vue';
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
            }
        },
        components: {
            'swatchPicker': Swatches,
            UsersDisplay,
        },
        computed: {
            currentUser() {
                return this.$root.$data.user;
            }
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
            async upload() {
                try {
                    const formData = new FormData();
                    formData.append('photo', this.file, this.file.name);
                    let r1 = await axios.post('/api/photos', formData);
                    console.log("Made past photot");
                    const id = this.currentUser._id;
                    await axios.post('/api/users/' + id + '/items', {
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
                if (this.userName === '') {
                    return;
                }
                try {
                    let response = await axios.post('/api/users', {
                        name: this.userName,
                        color: this.color.hex,
                    });
                    this.$root.$data.user = response.data;
                    this.userName = '';
                    this.getUsers();
                } catch (error) {
                    console.log(error);
                }
            },
            async getUsers() {
                try {
                  const response = await axios.get('/api/users');
                  this.users = response.data;
                  if (!this.currentUser && this.users.length > 0) {
                    this.$root.$data.user = this.users[0];
                  }
                } catch (error) {
                    console.log(error);
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

.swatchWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}
.white {
  color: #fff;
}
</style>
