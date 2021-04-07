<template>
  <div class="home">
    <PostList :posts="posts" />
  </div>
</template>

<script>
import PostList from "../components/PostList.vue"

export default {
  name: 'Home',
  components: {
    PostList
  },
  data () {
    return {

    }
  },
  computed: {
    posts () {
      return this.$root.$data.posts;
    }
  }
}
</script>
