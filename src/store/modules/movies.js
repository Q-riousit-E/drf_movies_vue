import axios from 'axios'

const state = {
  moviesObj: null,
  picked_movie: null
}

const mutations = {
  SET_MOVIES(state, moviesObj) {
    state.moviesObj = moviesObj
  },
  SET_PICKED_MOVIE(state, movie) {
    state.picked_movie = movie
  }
}

const actions = {
  getMovies({ commit }) {
    axios({
      method: 'get',
      url: 'http://localhost:8000/api/v1/movies/index/'
    })
    .then((res) => {
      console.log(res)
      commit('SET_MOVIES', res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  },
  pickMovie({ commit }, picked_movie_id) {
    // send axios request to get picked movie details
    axios({
      method: 'get',
      url: `http://localhost:8000/api/v1/movies/${picked_movie_id}/`
    })
    .then((res) => {
      console.log(res)
      commit('SET_PICKED_MOVIE', res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }
}

export default {
  namespaced: true, 
  state,
  mutations,
  actions
}