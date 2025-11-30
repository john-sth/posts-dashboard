<script setup>
//=========================================================================================================
// Module Name: HomeView
//=========================================================================================================
// Author: Johann Spenrath
//=========================================================================================================
// Description:
// - main Dashboard for displaying and searchin all posts,
// - visualizes all posts in graphs
//
// Usage:
//
//
//=========================================================================================================
// Notes:
//
//=========================================================================================================
// Dependencies:
//=========================================================================================================
import { ref, computed, onMounted } from 'vue'
import { usePostStore } from '@/stores/postStore'
import { RouterLink } from 'vue-router'
// add plugin for charts and labels
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.register(ChartDataLabels)

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
  // init Chart for likes, dislikes and views
  //================================================================
  const likeChart = document.getElementById('likesChart')
  new Chart(likeChart, {
    type: 'bar',
    data: {
      labels: postStore.posts.map((p, index) => index + 1 + '. ' + p.title.slice(0, 5) + '...'),
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
        {
          label: 'Views',
          data: postStore.posts.map((p) => p.views),
          backgroundColor: 'rgba(4, 162, 23, 0.6)',
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      text: 'Post Performance (Likes / Dislikes / Views)',
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      datalabels: {
        anchor: 'end', // position label at end of bar
        align: 'right', // align above the bar
        color: '#000',
        font: { size: 12, weight: 'bold' },
        formatter: (value) => value, // display the value
      },

      datasets: {
        bar: {
          barPercentage: 0.3,
          categoryPercentage: 0.8,
          maxBarThickness: 10,
        },
      },
      scales: {
        y: {
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
            padding: 12,
            font: { size: 12 },
          },
          title: {
            display: true,
            text: 'Posts',
            font: { size: 16 },
          },
        },
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 10,
            maxTicksLimit: 40,
            maxRotation: 45,
            minRotation: 45,
          },
          title: {
            display: true,
            text: 'Count',
            font: { size: 16 },
          },
          grid: {
            display: true,
            color: 'rgba(0,0,0,0.05)',
            lineWidth: 1,
          },
        },
      },
    },
  })

  //================================================================
  // Display tags in relation to likes and dislikes
  //================================================================
  const tagChart = chartCanvas.value.getContext('2d')
  chartInstance = new Chart(tagChart, {
    type: 'bar',
    data: {
      labels: Object.keys(likesPerTag.value, dislikesPerTag.value),
      datasets: [
        {
          label: 'Total Likes',
          data: Object.values(likesPerTag.value),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Total Dislikes',
          data: Object.values(dislikesPerTag.value),
          backgroundColor: 'rgba(14, 62, 35, 0.6)',
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
// map number of views to post
//================================================================
const viewsPerPost = computed(() => {
  const map = {}
  postStore.posts.forEach((post) => {
    post.title.forEach((title) => {
      if (!map[title]) map[title] = 0
      map[title] += post.views
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
  <h1 class="dashboard-title">Posts Analytics</h1>
  <div class="dashboard">
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
      <div v-if="postStore.loading">Loading...</div>
      <div v-else>
        <div v-for="(post, index) in filteredPosts" :key="post.id" class="post-card">
          <h3 class="post.title">{{ index + 1 }}. {{ post.title }}</h3>
          <p class="post.body">{{ post.body.slice(0, 100) }}...</p>
          <div class="post-meta">
            <div class="reactions">
              <!-- Thumbs up -->
              <span> 👍 {{ post.reactions.likes }} </span>
              <!-- Thumbs down -->
              <span> 👎 {{ post.reactions.dislikes }}</span>
              <div></div>
              <span class="tags"
                ><strong>Tags: </strong>
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
              </span>
            </div>
          </div>
          <div class="view-count">{{ post.views }} views</div>
          <div class="comments-count">💬 {{ post.comments }} comments</div>
          <div class="details">
            <RouterLink :to="`/post/${post.id}`"> Read More </RouterLink>
          </div>
        </div>
      </div>
      <div class="right">
        <h2>Graphs</h2>
        <div class="chart-wrapper">
          <canvas class="chart" id="likesChart"></canvas>
        </div>
        <table class="stats-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Likes</th>
              <th>Dislikes</th>
              <th>Views</th>
              <th>Tags</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(post, i) in postStore.posts" :key="post.id">
              <td>{{ i + 1 }}</td>
              <td>{{ post.title }}</td>
              <td>{{ post.reactions.likes }}</td>
              <td>{{ post.reactions.dislikes }}</td>
              <td>{{ post.views }}</td>
              <td>{{ post.tags.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
        <!--<canvas class="chart" ref="chartCanvas"></canvas> -->
      </div>
    </div>

    <div v-if="postStore.error">Failed to load posts.</div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
.split {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 1.5rem;
  justify-content: space-between;
  align-items: flex-start;
  height: calc(100vh - 160px);
  box-sizing: border-box;
}

.left {
  flex: 1 1 0;
  display: block;
  transition:
    transform 0.6s ease,
    font-weight 0.6s ease;
  /*display: grid;
  grid-template-columns: repeat(2, 1fr);*/
  gap: 0.5rem;
  align-content: start;
  overflow-y: auto;
  padding-right: 1rem;
}

.right {
  border-radius: 4px;
  transition:
    transform 0.6s ease,
    font-weight 0.6s ease;
  border: 3px solid #ccc;
  flex: 1 1 0;
  min-width: 300px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
}

.right:hover {
  transform: scale(1.06); /* Increase size on hover */
  border-color: cadetblue;
  color: black;
  background-color: white;
  /*font-weight: bold; /* Make font bold on hover */
  z-index: 1;
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
  width: 100%;
  margin: 0;
  font-family: 'Arial', sans-serif;
  padding: 2rem;
  flex-direction: column;
}

.dashboard-title {
  text-align: center;
  margin: 1rem 0 2rem 0;
  color: black;
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
  width: 500px;
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
.dropdown-btn:hover {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  transform: scale(1.06); /* Increase size on hover */
  border-color: black;
  color: black;
  background-color: white;
  /*font-weight: bold; /* Make font bold on hover */
  z-index: 1;
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
  box-sizing: border-box;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: left;
  transition:
    transform 0.6s ease,
    font-weight 0.6s ease;
  width: 100%;
  max-width: 100%;
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
  margin-right: 0.3rem;
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

.details {
  background: #2ebdd1;
  display: inline-block;
  color: white;
  padding: 0.2rem 0.5rem;
  margin-right: 0.3rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.details:hover {
  background-color: #2ebdd1;
  color: white;
}
.chart {
  margin-top: 2rem;
  min-width: 90%;
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
  /*padding: 0.5rem;*/
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}
.chart-canvas {
  width: 90% !important;
  height: 700px !important;
  display: block;
}

#likesChart {
  width: 100%;
  height: 600px;
}

.h1 {
  text-align: center;
  display: blog;
}

.h2 {
  text-align: center;
  display: blog;
}

.stats-table {
  width: 90%;
  border-collapse: collapse;
  text-align: left;
}

.stats-table th,
.stats-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #ccc;
}

.stats-table tbody tr:hover {
  background: #f5f5f5;
}

.stats-table-wrapper {
  max-height: 500px;
  overflow-y: auto;
}
</style>
