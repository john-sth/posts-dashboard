<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const posts = ref(null);
const loading = ref(true);

const BLOG_URL = "https://dummyjson.com/posts?limit=10";

onMounted(async () => {
  try {
    const res = await axios.get(BLOG_URL);
    posts.value = res.data.posts || res.data; 
  } catch (err) {
    console.error("Failed loading posts:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div id="app">
    <h1>Blog Posts</h1>

    <div v-if="loading">Loading...</div>

    <div v-else>
      <div v-for="post in posts" :key="post.id" class="post">
        <h2>{{ post.title }}</h2>
        <p>{{ post.body }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.post {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
}
</style>

