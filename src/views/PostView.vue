<script setup>
//=========================================================================================================
// Module Name: PostView
//=========================================================================================================
// Author: Johann Spenrath
//=========================================================================================================
// Description:
//     <Brief overview of what the module does.>
//     <Key functionalities, algorithms, or data processing performed.>
//
// Usage:
//     <Short example of how to use the module.>
//
// Dependencies:
//     - <dependency1>
//     - <dependency2>
//
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
  <div>
    <Post :post="post" :loading="postStore.loading" />
  </div>
</template>
