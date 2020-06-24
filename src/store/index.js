import Vue from 'vue'
import Vuex from 'vuex'

import todoItem from './modules/todoItem'
import todoList from './modules/todoList'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    todoItem,
    todoList,
  },
})
