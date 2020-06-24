import Vue from 'vue'
import VueRouter from 'vue-router'
import TheLayout from '../components/TheLayout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: TheLayout,
    children: [
      {
        path: '',
        name: 'Tasks',
        // route level code-splitting
        // this generates a separate chunk (tasks.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        components: {
          default: () =>
            import(/* webpackChunkName: "tasks" */ '../pages/PageTasks'),
          title: () =>
            import(/* webpackChunkName: "tasks" */ '../pages/DefaultTitle'),
        },
      },
      {
        path: 'task/:id',
        name: 'Task',
        props: {
          default: route => ({ taskId: Number(route.params.id) }),
          title: route => ({ taskId: Number(route.params.id) }),
        },
        components: {
          default: () =>
            import(/* webpackChunkName: "task" */ '../pages/PageTask'),
          title: () =>
            import(/* webpackChunkName: "task" */ '../pages/PageTaskTitle'),
        },
      },
    ],
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "404" */ '../pages/Page404'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
