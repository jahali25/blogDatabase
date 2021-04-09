<template>
<div class = "user-display">
    <div id="users">
        <button :style="{backgroundColor: user.color}"
        :class="{ white: darkColor(user.color), selected: active(user)}"
        v-for="user in users" :key=user.id
        @click=selectUser(user)>{{user.name}}</button>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'UsersDisplay',
    data() {
        return {
            users: [],
        }
    },
    computed: {
        currentUser() {
            return this.$root.$data.user;
        }
    },
    created() {
        this.getUsers();
    },
    methods: {
        active(user) {
          return (this.currentUser && user._id === this.currentUser._id);
        },
        async getUsers() {
            try {
              const response = await axios.get('/api/users');
              this.users = response.data;
              if (!this.currentUser && this.users.length > 0) {
                this.selectUser(this.users[0]);
              }
            } catch (error) {
                console.log(error);
            }
        },
        selectUser(user) {
            this.$root.$data.user = user;
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
.white {
  color: #fff;
}

#users button {
    margin: 5px;
    padding: 3px;
    font-size: 18px;
}

.active {
    border: 1px solid #ddd;
}

.white .active {
    border: 2px solid white;
}
</style>
