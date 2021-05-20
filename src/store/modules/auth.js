import axios from 'axios'
import jwt_decode from "jwt-decode";

const state = {
  token: null,
  decodedToken: null,
}

const mutations = {
  SAVE_JWT(state, token) {
    state.token = token
    state.decodedToken = jwt_decode(state.token)
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
      url: '/api/v1/accounts/signup/',
      data: credentials
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
      })
    },
    
  login({ commit }, credentials) {
    console.log(credentials)
    axios({
    method: 'post',
    url: '/api/v1/accounts/login/',
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
  actions,
}
