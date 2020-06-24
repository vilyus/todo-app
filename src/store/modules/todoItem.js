import Vue from 'vue'

import axios from '../../api'

export default {
  namespaced: true,

  state: {
    // all `TodoItem`s grouped by their ids, e.g.:
    // { '1': { id: 1, title: 'Do smth.', ... }, ... }
    map: {},
  },

  getters: {
    // functional getter to get one `TodoItem` from store by its id
    get: state => id => state.map[id] || null,
  },

  mutations: {
    // store all `TodoItem`s
    setList: (state, { todoItems }) => {
      todoItems.forEach(todoItem =>
        Vue.set(state.map, todoItem.id, todoItem))
    },
    // store one `TodoItem`
    setOne: (state, { todoItem }) => {
      Vue.set(state.map, todoItem.id, todoItem)
    },
    // clear `TodoItem`
    forgetOne: (state, { todoItemId }) => {
      Vue.delete(state.map, todoItemId)
    },
  },

  actions: {
    // create new `TodoItem`
    create: ({ commit }, { todoItem }) =>
      axios.post('/todo-item/', todoItem),

    // update `TodoItem`
    update: ({ commit }, { todoItem }) =>
      axios.put(`/todo-item/${todoItem.id}`, todoItem),

    // delete `TodoItem`
    delete: ({ commit }, { todoItemId }) =>
      axios.delete(`/todo-item/${todoItemId}`)
        .then(() => commit('forgetOne', { todoItemId })),
  },
}
