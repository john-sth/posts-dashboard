<script setup>
//=========================================================================================================
// Module Name: PostView
//=========================================================================================================
// Author: Johann Spenrath
//=========================================================================================================
// Description:
// -
//
// Usage:
// - display an invidivual page for one post
//   to see the details of it
//
// Dependencies:
//=========================================================================================================
// Notes:
//
//=========================================================================================================
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePostStore } from '@/stores/postStore'
import Post from '@/components/Post.vue'

const route = useRoute()
const postStore = usePostStore()
const id = route.params.id

onMounted(async () => {
  if (!postStore.posts.length) {
    await postStore.fetchPosts()
  }
})

const post = computed(() => postStore.posts.find((p) => p.id == id))
</script>

<template>
  <button class="back-button">
    <RouterLink :to="`/`"> Back </RouterLink>
  </button>
  <div class="postview-wrapper">
    <Post :post="post" :loading="postStore.loading" />
  </div>
</template>

<style>
.postview-wrapper {
  max-width: 800px;
  margin: 0 auto; /* centers horizontally */
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.back-button {
  margin-left: 20rem;
  padding: 1rem;
  justify-content: left;
}
</style>
