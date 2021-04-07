<template>
<div class="postList">
    <div class="posts" v-if="!foundItem">
        <div class="post" v-for="post in posts" :key="post.id" @click="selectPost(post)">
            <div class="info">
                <h2>{{post.title}}</h2>
                <p>Posted on {{post.date}}, at {{post.time}}</p>
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
            <p>Posted on {{foundItem.date}}, at {{foundItem.time}}</p>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'PostList',
    data(){
        return {
            foundItem: null,
            posts: [],
        }
    },
    created() {
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

</style>
