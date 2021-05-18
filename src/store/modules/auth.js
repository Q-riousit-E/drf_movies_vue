import axios from 'axios'

const state = {
  token: null,
}

const mutations = {
  SAVE_JWT(state, token) {
    state.token = token
  },
  DELETE_JWT(state) {
    state.token = null
  }
}

const actions = {
  signup({ commit }, credentials) {
    console.log(credentials)
    axios({
      method: 'post',
      url: 'accounts/signup/',
      data: credentials
    })
    .then((res) => {
      console.log(res)
      // commit('SAVE_JWT', res.data)
    })
    .catch((err) => {
      console.log(err)
      })
    },
    
    login({ commit }, credentials) {
      console.log(credentials)
      axios({
      method: 'post',
      // url: 'api/accounts/login/',
      url: 'accounts/api-token-auth/',
      data: credentials
    })
      .then((res) => {
        console.log(res)
        commit('SAVE_JWT', res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },

  logout({ commit }) {
    commit('DELETE_JWT')
  }
}

export default {
  namespaced: true, 
  state,
  mutations,
  actions
}
