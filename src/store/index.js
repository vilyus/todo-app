import Vue from 'vue'
import Vuex from 'vuex'

import todoItem from './modules/todoItem'
import task from './modules/task'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    todoItem,
    task,
  },
})
