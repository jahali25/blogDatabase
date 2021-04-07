<template>
<div class="addPage">
    <h1>Blog Post</h1>
    <p>This is the page to add blog posts</p>
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
    export default {
        name: 'AddPost',
        data() {
            return {
                title: "",
                post: "",
                file: null,
                items: [],
                date: "",
                time: "",
                beenPosted: false,
            }
        },
        computed: {

        },
        created() {
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
            getItems() {
                this.items = this.$root.$data.posts;
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
            }
        },

    }
</script>
