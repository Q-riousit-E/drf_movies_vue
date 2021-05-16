const state = {
  logged_in: false
}

const mutations = {
  SET_STATUS_TO_LOGGED_IN(state) {
    state.logged_in = true
  },
  SET_STATUS_TO_LOGGED_OUT(state) {
    state.logged_in = false
  }
}

const actions = {
  login({ commit }) {
    commit('SET_STATUS_TO_LOGGED_IN')
  },

  logout({ commit }) {
    commit('SET_STATUS_TO_LOGGED_OUT')
  }
}

export default {
  namespaced: true, 
  state,
  mutations,
  actions
}
