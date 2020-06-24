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
        name: 'TodoLists',
        // route level code-splitting
        // this generates a separate chunk (todo-lists.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        components: {
          default: () =>
            import(/* webpackChunkName: "todo-lists" */ '../pages/PageTodoLists'),
          title: () =>
            import(/* webpackChunkName: "todo-lists" */ '../pages/DefaultTitle'),
        },
      },
      {
        path: 'task/:id',
        name: 'TodoList',
        props: {
          default: route => ({ todoListId: Number(route.params.id) }),
          title: route => ({ todoListId: Number(route.params.id) }),
        },
        components: {
          default: () =>
            import(/* webpackChunkName: "todo-list" */ '../pages/PageTodoList'),
          title: () =>
            import(/* webpackChunkName: "todo-list" */ '../pages/PageTodoListTitle'),
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
