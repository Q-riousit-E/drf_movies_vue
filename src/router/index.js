import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Articles from '@/views/Articles.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'

import Signup from '@/views/Signup.vue'
import Login from '@/views/Login.vue'
import Logout from '@/views/Logout.vue'
import Testing from '@/views/Testing.vue'
import MovieDetail from '@/views/MovieDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: ArticleDetail
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/testing',
    name: 'Testing',
    component: Testing
  },
  {
    path: '/*/movies/:movie_id',
    name: 'MovieDetail',
    component: MovieDetail
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
