<script setup>
//=========================================================================================================
// Module Name: Post.vue
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

import { ref, onMounted, watch } from 'vue'
import { usePostStore } from '@/stores/postStore'

const props = defineProps({
  post: Object,
  loading: Boolean,
})

//=========================================
// fetch user info, defined in postStore
//=========================================

const postStore = usePostStore()
const user = ref(null)

onMounted(async () => {
  if (props.post?.userId) {
    user.value = await postStore.fetchUser(props.post.userId)
  }
})

//=========================================
// watch post changes if reused
//=========================================
watch(
  () => props.post,
  async (newPost) => {
    if (newPost?.userId) {
      user.value = await postStore.fetchUser(newPost.userId)
    }
  },
)
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else class="post-single">
    <h2>{{ post.title }}</h2>
    <p>{{ post.body }}</p>

    <div class="post-meta">
      <p>Author: {{ user?.firstName }} {{ user?.lastName }}</p>
      <div class="reactions">
        <p>Likes: {{ post.reactions.likes }}</p>
        <p>Dislikes: {{ post.reactions.dislikes }}</p>
      </div>
      <div class="tags">
        Tags:
        <span v-for="tag in post.tags" :key="tag">"{{ tag }}" </span>
      </div>
      <p>User ID: {{ post.userId }}</p>
    </div>
  </div>
</template>

<style scoped>
.post-single {
  padding: 1rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}
.post-meta p {
  margin: 0.25rem 0;
}
.post-meta {
  margin-top: 1rem;
}
.reactions span {
  margin-right: 1rem;
  font-weight: bold;
}
.tags {
  margin-top: 0.5rem;
}
.tag {
  display: inline-block;
  margin-right: 0.5rem;
  padding: 0.2rem 0.5rem;
  background-color: #0077ff;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: uppercase;
}
</style>
