<script setup>
//=========================================================================================================
// Module Name: HomeView
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

import { ref, computed, onMounted } from 'vue'
import { usePostStore } from '@/stores/postStore'
import { RouterLink } from 'vue-router'
// import chart functionality
import { Chart, registerables, Ticks } from 'chart.js'
Chart.register(...registerables)

const postStore = usePostStore()

//================================================================
// search and filter functionality
//================================================================
//=== array for multiple selected tags
const selectedTags = ref([])
const dropdownOpenTags = ref(false)
const dropdownOpenIds = ref(false)
//=== search after a keyword
const searchTerm = ref('')
//=== filter after user-ids
const selectedUserIDs = ref([])

let chartInstance = null
const chartCanvas = ref(null)

//================================================================
// Data Visualization
//================================================================
const minLikes = ref('')
const minDislikes = ref('')

onMounted(async () => {
  // init : display all posts
  await postStore.fetchPosts()

  //================================================================
  // init Chart
  //================================================================
  const likeChart = document.getElementById('likesChart')
  new Chart(likeChart, {
    type: 'bar',
    data: {
      labels: postStore.posts.map((p) => p.title.slice(0, 15) + '...'),
      datasets: [
        {
          label: 'Likes',
          data: postStore.posts.map((p) => p.reactions.likes),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Dislikes',
          data: postStore.posts.map((p) => p.reactions.dislikes),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { Ticks: { stepSize: 100 } },
        x: { Ticks: { stepSize: 100 } },
      },
    },
  })

  const tagChart = chartCanvas.value.getContext('2d')
  chartInstance = new Chart(tagChart, {
    type: 'bar',
    data: {
      labels: Object.keys(likesPerTag.value),
      datasets: [
        {
          label: 'Total Likes',
          data: Object.values(likesPerTag.value),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { beginAtZero: true }, stepSize: 400 },
    },
  })
})

//================================================================
// get all tags from posts
//================================================================
const allTags = computed(() => {
  const tagsSet = new Set()
  postStore.posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag))
  })
  return Array.from(tagsSet).sort()
})

//================================================================
// get all user ids from posts
//================================================================
const allUserIDs = computed(() => {
  const userSet = new Set()
  postStore.posts.forEach((post) => {
    userSet.add(post.userId)
  })
  return Array.from(userSet).sort()
})

//================================================================
// map the total numbers of likes/dislikes for each tag
//================================================================

const likesPerTag = computed(() => {
  const map = {}
  postStore.posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!map[tag]) map[tag] = 0
      map[tag] += post.reactions.likes
    })
  })
  return map
})

const dislikesPerTag = computed(() => {
  const map = {}
  postStore.posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!map[tag]) map[tag] = 0
      map[tag] += post.reactions.dislikes
    })
  })
  return map
})
//================================================================
// filter posts by selected tag
// filer posts according to the search term in the searchbar
// allow case insensetive
//================================================================
const filteredPosts = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return postStore.posts.filter((post) => {
    // Tag filter
    // Search filter
    const termMatch = post.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    const tagMatch =
      selectedTags.value.length === 0 || post.tags.some((t) => selectedTags.value.includes(t))
    const usersMatch =
      selectedUserIDs.value.length === 0 || selectedUserIDs.value.includes(post.userId)
    const likesMatch = minLikes.value === '' || post.reactions.likes >= parseInt(minLikes.value)
    const dislikesMatch =
      minDislikes.value === '' || post.reactions.dislikes >= parseInt(minDislikes.value)
    return termMatch && tagMatch && usersMatch && likesMatch && dislikesMatch
  })
})

//================================================================
// Toggle dropdown
//================================================================
function toggleDropdownTags() {
  dropdownOpenTags.value = !dropdownOpenTags.value
}

function toggleDropdownIds() {
  dropdownOpenIds.value = !dropdownOpenIds.value
}

//================================================================
// Clear all selected values
//================================================================
function clearTags() {
  selectedTags.value = []
}

function clearUserIds() {
  selectedUserIDs.value = []
}
</script>

<template>
  <div class="dashboard">
    <h1 dashboard-title>Posts Dashboard</h1>

    <!-- Search and Filter Bar-->
    <div class="filter-bar">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="search for a keyword..."
        class="search-input"
      />

      <div class="dropdown">
        <button @click="toggleDropdownTags" class="dropdown-btn">
          Tags
          <span v-if="selectedTags.length">({{ selectedTags.length }})</span>
        </button>

        <div v-if="dropdownOpenTags" class="dropdown-menu">
          <button @click="toggleDropdownTags" class="clear-btn">X</button>
          <button @click="clearTags" class="clear-btn">Clear All</button>
          <label v-for="tag in allTags" :key="tag" class="dropdown-item">
            <input type="checkbox" :value="tag" v-model="selectedTags" />
            {{ tag }}
          </label>
        </div>
      </div>
      <div class="dropdown">
        <button @click="toggleDropdownIds" class="dropdown-btn">
          UserIds
          <span v-if="selectedUserIDs.length">({{ selectedUserIDs.length }})</span>
        </button>

        <div v-if="dropdownOpenIds" class="dropdown-menu">
          <button @click="toggleDropdownIds" class="clear-btn">X</button>
          <button @click="clearUserIds" class="clear-btn">Clear All</button>
          <label v-for="id in allUserIDs" :key="id" class="dropdown-item">
            <input type="checkbox" :value="id" v-model="selectedUserIDs" />
            {{ id }}
          </label>
        </div>
      </div>
    </div>

    <div class="split">
      <div class="left">
        <div v-if="postStore.loading">Loading...</div>
        <div v-else>
          <div v-for="post in filteredPosts" :key="post.id" class="post-card">
            <h3 class="post.title">{{ post.title }}</h3>
            <p class="post.body">{{ post.body.slice(0, 100) }}...</p>
            <div class="post-meta">
              <div class="reactions">
                <!-- Thumbs up -->
                <div class="like grow">
                  <i class="fa fa-thumbs-up fa-3x like" aria-hidden="true"></i>
                  <span class="likes"> {{ post.reactions.likes }}</span>
                </div>
                <span class="dislikes">
                  <!-- Thumbs down -->
                  <div class="dislike grow">
                    <i class="fa fa-thumbs-down fa-3x like" aria-hidden="true"></i>
                  </div>
                  {{ post.reactions.dislikes }}</span
                >
                <div></div>
                <span class="tags"
                  ><strong>Tags: </strong>
                  <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
                </span>
              </div>
              <div class="comments-count">💬 {{ post.comments?.length || 0 }} comments</div>
            </div>
            <div class="details">
              <RouterLink :to="`/post/${post.id}`"> Read More </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <h2>Graphs</h2>
        <div class="chart-wrapper">
          <canvas
            class="chart"
            id="likesChart"
            style="max-width: 1000px; margin-top: 2rem"
          ></canvas>
        </div>
        <canvas class="chart" ref="chartCanvas" style="max-width: 800px; margin-top: 4rem"></canvas>
      </div>
    </div>

    <div v-if="postStore.error">Failed to load posts.</div>
  </div>
</template>

<style scoped>
.split {
  display: flex;
  height: 100vh;
}

.left {
  flex: 1;
  padding: 1rem;
  display: flex;
  /* wrap to the next line */
  flex-wrap: wrap;
  justify-content: left;
  align-items: flex-start;
  flex-direction: row;
  min-height: 80vh;
  margin: 0 auto;
}

.right {
  flex: 1;
  background: #ffffff;
  padding: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
  display: flex;
  /* wrap children to the next line */
  flex-wrap: wrap;
  justify-content: center;
}

li {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.dashboard {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  font-family: 'Arial', sans-serif;
  padding: 2rem;
}

.dashboard-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #0077ff;
}

.filter-bar {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.search-input,
.small-input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 300px;
}

.small-input {
  width: 100px;
}

.dropdown {
  position: relative;
}
.dropdown-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: white;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 0.25rem;
  z-index: 10;
  padding: 0.5rem;
  text-align: left;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.clear-btn {
  margin-bottom: 0.5rem;
  width: 100%;
  background: #eee;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 4px;
}

.post-card {
  border: 3px solid #ccc;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
}
.post-card:hover {
  transform: scale(1.06); /* Increase size on hover */
  border-color: cadetblue;
  color: black;
  background-color: white;
  /*font-weight: bold; /* Make font bold on hover */
  z-index: 1;
}

.post-title {
  color: #0077ff;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.post-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.tag {
  background: #0077ff;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.tag:hover {
  transform: scale(1.2); /* Increase size on hover */
  border-color: cadetblue;
  color: white;
  background-color: #0077ff;
  /*font-weight: bold; /* Make font bold on hover */
  z-index: 3;
}

.chart {
  margin-top: 2rem;
  max-width: 100%;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}

.loading {
  font-weight: bold;
  margin-top: 1rem;
}

.rating {
  display: inline-block;
  width: 100%;
  margin-top: 40px;
  padding-top: 40px;
  text-align: center;
}

.like,
.dislike {
  display: inline-block;
  cursor: pointer;
  margin: 10px;
}

.dislike:hover,
.like:hover {
  color: #2ebdd1;
  transition: all 0.2s ease-in-out;
  transform: scale(1.1);
}

.active {
  color: #2ebdd1;
}

.details {
  margin-top: 20px;
  text-decoration: none;
}
a {
  text-decoration: none;
}
a:visited {
  color: inherit;
}

.chart-wrapper {
  max-height: 600px; /* or whatever height you want */
  overflow-y: auto;
}
</style>
