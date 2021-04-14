<template>
<div class="editor">
  <UsersDisplay />
  <div class="find">
    <div class="form">
      <input v-model="findTitle" placeholder="Search">
      <div class="suggestions" v-if="suggestions.length > 0">
        <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">
          {{s.title}}
        </div>
      </div>
    </div>
  </div>
  <div class="upload" v-if="findItem">
      <input v-model="findItem.title">
      <p></p>
      <input v-model="findItem.date">
      <p></p>
      <input v-model="findItem.time">
      <p></p>
      <textarea v-model="findItem.paragraphs"></textarea>
  </div>
  <div class="actions" v-if="findItem">
      <button @click="deleteItem(findItem)">Delete</button>
      <button @click="editItem(findItem)">Edit</button>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import UsersDisplay from '@/components/UsersDisplay.vue';
export default {
  name: "EditPost",
  components: {
    UsersDisplay,
  },
  data() {
          return {
              findTitle: "",
              posts: [],
              findItem: null,
              users: [],
          }
  },
  computed: {
    suggestions() {
      let items = this.posts.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return items.sort((a, b) => a.title > b.title);
    },
    currentUser() {
      return this.$root.$data.user;
    }
  },
  created() {
    this.getItems();
  },
  methods:
   {
    isContained(item) {
      const search = this.findTitle.toLowerCase();
      return item.title.toLowerCase().startsWith(search);
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async deleteItem(item) {
      try {
        await axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editItem(item) {
      try {
        await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          paragraphs: this.findItem.paragraphs,
          date: this.findItem.date,
          time: this.findItem.time,
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
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
    }
  },
  async getUsers() {
    try {
      const response = await axios.get('/api/users');
      this.users = response.data;
    } catch (error) {
        console.log(error);
    }
  }
}
</script>

<style scoped>
.find {
  display: flex;
}

/*Form*/
input, textarea, select, button {
  font-family: 'Monstserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-top: 10px;
  margin-right: 50px;
  margin-left: 50px;
  margin-bottom: 20px;
}

.form input {
  margin-bottom: 10px;
}

textarea {
  width: 50%;
  height: 50px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}

button {
  margin: 5px 3px;

}

.find {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
</style>
