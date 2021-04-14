<template>
<div class="postList">
    <!-- <div id="users">
        <button :style="{backgroundColor: user.color}"
        :class="{ white: darkColor(user.color), selected: active(user)}"
        v-for="user in users" :key=user.id
        @click=selectUser(user)>{{user.name}}</button>
    </div> -->
    <UsersDisplay />
    <div class="posts" v-if="!foundItem">
        <div class="post" v-for="post in posts" :key="post.id" @click="selectPost(post)">
            <div class="info">
                <h2>{{post.title}}</h2>
                <p>Posted on {{post.date}}, at {{post.time}} by
                {{post.user.name}}</p>
            </div>
        </div>
    </div>
    <div class="singlePost" v-else>
        <div class="postInfo" @click="deselectPost">
            <h2>{{foundItem.title}}</h2>
            <img :src="foundItem.path"/>
            <div class="postBody" v-for="para in foundItem.paragraphs" :key="para">
                <p>{{para}}</p>
            </div>
            <p>Posted on {{foundItem.date}}, at {{foundItem.time}} by
            {{foundItem.user.name}}</p>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import UsersDisplay from '@/components/UsersDisplay.vue';
export default {
    name: 'PostList',
    components: {
        UsersDisplay
    },
    data(){
        return {
            foundItem: null,
            posts: [],
            users: [],
            user: null,
        }
    },
    created() {
        this.getUsers();
        this.getItems();
    },
    methods: {
        selectPost(post) {
            this.foundItem = post;

        },
        deselectPost () {
            this.foundItem = null;
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
        active(user) {
          return (this.user && user._id === this.user._id);
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

.postBody p {
    margin: 20px;
}

.postBody {
    font-style: italic;
}

.white {
  color: #fff;
}

img {
    width: 100%;
}

</style>
