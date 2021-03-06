import axios from 'axios'
import jwt_decode from "jwt-decode";

// const url = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : ''
const url = 'https://api.movietalk.site'
// const url = 'https://3.37.64.174'


const state = {
  token: null,
  decodedToken: null,
}

const mutations = {
  SAVE_JWT(state, token) {
    state.token = token
    console.log(token)
    state.decodedToken = jwt_decode(token)
  },
  DELETE_JWT(state) {
    state.token = null
    state.decodedToken = null
  }
}

const actions = {
  signup({ commit }, credentials) {
    console.log(credentials)
    axios({
      method: 'post',
      url: url + '/api/v1/accounts/signup/',
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
    url: url + '/api/v1/accounts/login/',
    data: credentials
  })
    .then((res) => {
      console.log(res)
      commit('SAVE_JWT', res.data.token)
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
