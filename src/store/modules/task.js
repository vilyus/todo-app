import * as R from 'ramda'
import Vue from 'vue'

import axios from '../../api'

const setOne = ({ commit, state, getters }, { task }) => {
  // 1. extract `TodoItem`s
  const { items: todoItems } = task

  // 2. replace items with list of their ids
  delete task.items
  task.itemIds = R.map(R.prop('id'), todoItems)

  // 3. commit to another Vuex-module
  commit('todoItem/setList', { todoItems }, { root: true })

  // 4. store lists of items
  commit('set', { task })

  // 5. update order
  if (state.serverOrder && !state.serverOrder.includes(task.id)) {
    commit('setOrder', {
      tasks: [...getters.list, task],
    })
  }
}

const forgetOne = ({ commit, getters }, { taskId }) => {
  // remove a `Task`
  const task = getters.get(taskId)
  // remove its items
  if (task) {
    task.items.forEach(item =>
      commit('todoItem/forgetOne', { todoItemId: item.id }, { root: true }))
  }
  commit('forgetOne', { taskId })
}

const setList = ({ commit, state, getters }, { tasks }) => {
  // helper to commit tasks to this module and items to another module
  tasks.forEach(task => setOne({ commit, state, getters }, { task }))
  commit('setOrder', { tasks })
}

export default {
  namespaced: true,

  state: {
    // `Task`s grouped by id
    map: {},
    // original server order, null indicates loading state
    serverOrder: null,
  },

  getters: {
    // functional getter: get one denormalized `Task` by its id
    get: (state, getters, rootState, rootGetters) => id => {
      const task = state.map[id] || null
      return task && R.pipe(
        R.assoc('items', R.pipe(
          R.map(rootGetters['todoItem/get']),
          R.sortBy(R.prop('order')),
        )(task.itemIds)),
        R.omit(['itemIds']),
      )(task)
    },
    // list of loaded `Task`s or null (loading)
    list: (state, getters) =>
      state.serverOrder && state.serverOrder.map(getters.get),
  },

  mutations: {
    // store `Task`
    set: (state, { task }) => {
      Vue.set(state.map, task.id, task)
    },

    // store the order of `Task`s
    setOrder: (state, { tasks }) => {
      state.serverOrder = R.map(R.prop('id'), tasks)
    },

    // remove a `Task`
    forgetOne: (state, { taskId }) => {
      state.serverOrder = state.serverOrder &&
        state.serverOrder.filter(id => id !== taskId)
      Vue.delete(state.map, taskId)
    },
  },

  actions: {
    // fetch one `Task` by its id
    get: ({ commit, state, getters }, { taskId }) =>
      axios.get(`/task/${taskId}`)
        .then(({ data: task }) =>
          setOne({ commit, state, getters }, { task })),

    // fetch all `Task`s
    getList: ({ commit, state, getters }) =>
      axios.get('/task/')
        .then(({ data: tasks }) =>
          setList({ commit, state, getters }, { tasks })),

    // create a `Task`
    create: ({ commit, state, getters }, { task }) =>
      axios.post('/task/', task)
        .then(({ data: task }) => {
          setOne({ commit, state, getters }, { task })
          return task
        }),

    // update a `Task`
    update: ({ commit, state, getters }, { task }) =>
      axios.put(`/task/${task.id}`, task)
        .then(({ data: task }) =>
          setOne({ commit, state, getters }, { task })),

    // delete a `Task`
    delete: ({ commit, getters }, { taskId }) =>
      axios.delete(`/task/${taskId}`)
        .then(() => forgetOne({ commit, getters }, { taskId })),
  },
}
