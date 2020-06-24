const DEFAULT_DESCRIPTION = 'Changes reverted. Want to redo them?'

export default {
  namespaced: true,

  state: {
    undo: {
      fn: null, // function to undo the latest change
      description: DEFAULT_DESCRIPTION,
    },
    timeoutId: null,
  },

  mutations: {
    set: (
      state,
      { fn, description = DEFAULT_DESCRIPTION, timeoutId = null },
    ) => {
      state.undo = { fn, description }
      state.timeoutId = timeoutId
    },
  },

  actions: {
    register(
      { state, commit },
      { fn = null, description = DEFAULT_DESCRIPTION, timeout = 15000 },
    ) {
      clearTimeout(state.timeoutId)
      const timeoutId = timeout
        ? setTimeout(() => commit('set', { fn: null }), timeout)
        : null
      commit('set', { fn, description, timeoutId })
    },

    rollback({ state, commit }) {
      const undo = state.undo.fn

      clearTimeout(state.timeoutId)
      commit('set', { fn: null })

      return Promise.resolve(undo && undo())
    },
  },
}
