import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'articles',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/articles/:id',
      name: 'article',
      component: () => import('../views/ArticleDetail.vue')
    },
    {
      path: '/articles/publish',
      name: 'articlepub',
      component: () => import('../views/PublishArticleView.vue')
    },
    {
      path: '/qa',
      name: 'qa',
      component: () => import('../views/QAView.vue')
    },
    {
      path: '/author/:id',
      name: 'author',
      component: () => import('../views/AuthorView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchResultView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    }
  ]
})
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
export default router
