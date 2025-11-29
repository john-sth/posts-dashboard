// ===========================================================

// ===========================================================
import { createRouter, createWebHistory } from 'vue-router'
// ===========================================================
// import the different views
// ===========================================================
import HomeView from '@/views/HomeView.vue'
import PostView from '@/views/PostView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/post/:id', name: 'PostView', component: PostView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
