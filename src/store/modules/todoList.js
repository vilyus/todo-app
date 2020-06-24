import * as R from 'ramda'
import Vue from 'vue'

import axios from '../../api'

const setOne = ({ commit, state, getters }, { todoList }) => {
  // 1. extract `TodoItem`s
  const { items: todoItems } = todoList

  // 2. replace items with list of their ids
  delete todoList.items
  todoList.itemIds = R.map(R.prop('id'), todoItems)

  // 3. commit to another Vuex-module
  commit('todoItem/setList', { todoItems }, { root: true })

  // 4. store lists of items
  commit('set', { todoList })

  // 5. update order
  if (state.serverOrder && !state.serverOrder.includes(todoList.id)) {
    commit('setOrder', {
      todoLists: [...getters.list, todoList],
    })
  }
}

const setList = ({ commit, state, getters }, { todoLists }) => {
  // helper to commit todoLists to this module and items to another module
  todoLists.forEach(todoList => setOne({ commit, state, getters }, { todoList }))
  commit('setOrder', { todoLists })
}

export default {
  namespaced: true,

  state: {
    // `TodoList`s grouped by id
    map: {},
    // original server order, null indicates loading state
    serverOrder: null,
  },

  getters: {
    // functional getter: get one denormalized `TodoList` by its id
    get: (state, getters, rootState, rootGetters) => id => {
      const todoList = state.map[id] || null
      return todoList && R.pipe(
        R.assoc('items', R.pipe(
          R.map(rootGetters['todoItem/get']),
          R.sortBy(R.prop('order')),
        )(todoList.itemIds)),
        R.omit(['itemIds']),
      )(todoList)
    },
    // list of loaded `TodoList`s or null (loading)
    list: (state, getters) =>
      state.serverOrder && state.serverOrder.map(getters.get),
  },

  mutations: {
    // store `TodoList`
    set: (state, { todoList }) => {
      Vue.set(state.map, todoList.id, todoList)
    },

    // store the order of `TodoList`s
    setOrder: (state, { todoLists }) => {
      state.serverOrder = R.map(R.prop('id'), todoLists)
    },

    // remove a `TodoList`
    forget: (state, { todoListId }) => {
      state.serverOrder = state.serverOrder &&
        state.serverOrder.filter(id => id !== todoListId)
      Vue.delete(state.map, todoListId)
    },
  },

  actions: {
    // fetch one `TodoList` by its id
    get: ({ commit, state, getters }, { todoListId }) =>
      axios.get(`/todo-list/${todoListId}`)
        .then(({ data: todoList }) =>
          setOne({ commit, state, getters }, { todoList })),

    // fetch all `TodoList`s
    getList: ({ commit, state, getters }) =>
      axios.get('/todo-list/')
        .then(({ data: todoLists }) =>
          setList({ commit, state, getters }, { todoLists })),

    // create a `TodoList`
    create: ({ commit, state, getters }, { todoList }) =>
      axios.post('/todo-list/', todoList)
        .then(({ data: todoList }) =>
          setOne({ commit, state, getters }, { todoList })),

    // update a `TodoList`
    update: ({ commit, state }, { todoList }) =>
      axios.put(`/todo-list/${todoList.id}`, todoList),

    // delete a `TodoList`
    delete: ({ commit, state }, { todoListId }) =>
      axios.delete(`/todo-list/${todoListId}`)
        .then(() => commit('forget', { todoListId })),
  },
}
