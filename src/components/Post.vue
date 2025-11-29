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
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
import { nextTick } from 'vue'

const props = defineProps({
  post: Object,
  loading: Boolean,
})

//=========================================
// register parts for the chart
//=========================================
Chart.register(PieController, ArcElement, Tooltip, Legend)

//=========================================
// fetch user info, defined in postStore
//=========================================

const postStore = usePostStore()
const user = ref(null)
const chartCanvas = ref(null)
let chartInstance = null

onMounted(async () => {
  if (props.post?.userId) {
    user.value = await postStore.fetchUser(props.post.userId)
    // draw chart if a post is found
    await nextTick()
    drawChart()
  }
})

//==========================
// d
//==========================
function drawChart() {
  if (!chartCanvas.value) return

  if (chartInstance) chartInstance.destroy()

  const data = {
    labels: ['Likes', 'Dislikes'],
    datasets: [
      {
        data: [props.post.reactions.likes, props.post.reactions.dislikes],
      },
    ],
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'pie',
    data,
    options: {
      responsive: true,
    },
  })
}

//=========================================
// watch post changes if reused
//=========================================
watch(
  () => props.post,
  async (newPost) => {
    if (!newPost) return

    user.value = await postStore.fetchUser(newPost.userId)
    await nextTick()
    drawChart()
  },
)
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else class="post-single">
    <h2>{{ post.title }}</h2>
    <p>{{ post.body }}</p>

    <div class="post-meta">
      <h3>Details:</h3>
      <p><strong>Author:</strong> {{ user?.firstName }} {{ user?.lastName }}</p>
      <div class="reactions">
        <p><strong>Likes:</strong> {{ post.reactions.likes }}</p>
        <p><strong>Dislikes:</strong> {{ post.reactions.dislikes }}</p>
      </div>
      <div class="tags">
        <strong>Tags:</strong>
        <span v-for="tag in post.tags" :key="tag">"{{ tag }}" </span>
      </div>
      <p><strong>User-ID:</strong> {{ post.userId }}</p>
    </div>
    <h2>Reactions</h2>
    <canvas class="chart-pie" ref="chartCanvas" width="50" height="50"></canvas>
  </div>
</template>

<style scoped>
.post-single {
  padding: 1rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  transition:
    transform 0.6s ease,
    font-weight 0.6 ease;

  margin-bottom: 1rem;
}
.post-meta p {
  margin: 0.25rem 0;
}
.post-meta {
  margin-top: 1rem;
  border: 2px #ccc;
}
.chart-pie:hover {
  transform: scale(1.06); /* Increase size on hover */
  border-color: cadetblue;
  color: black;
  background-color: white;
  /*font-weight: bold; /* Make font bold on hover */
  z-index: 1;
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
