<template>
<div class="editor">
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
export default {
  name: "EditPost",
  data() {
          return {
              findTitle: "",
              posts: [],
              findItem: null,
          }
  },
  computed: {
    suggestions() {
      let posts = this.posts.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));

      return posts.sort((a, b) => a.title > b.title);
    }
  },
  created() {
    this.posts = this.$root.$data.posts;
  },
  methods: {
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    deleteItem(item) {
      const index = this.posts.findIndex(element => element.id == item.id);
      this.$root.$data.posts.splice(index, 1);
      this.findItem = null;
      this.posts = this.$root.$data.posts;
    },
    editItem(item) {
      const index = this.posts.findIndex(element => element.id == item.id);
      this.$root.$data.posts.splice(index, 1, item);
      this.findItem = null;
      this.posts = this.$root.$data.posts;
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
</style>
