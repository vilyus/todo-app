import Vue from 'vue'

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

    // clear `TodoItem`
    forgetOne: (state, { todoItemId }) => {
      Vue.delete(state.map, todoItemId)
    },
  },
}
