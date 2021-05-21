import axios from 'axios'

const state = {
  moviesObj: null,
  picked_movie_id: null,
  picked_movie: null
}

const mutations = {
  SET_MOVIES(state, moviesObj) {
    state.moviesObj = moviesObj
  },
  PICK_MOVIE(state, picked_movie_id) {
    state.picked_movie_id = picked_movie_id
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
    commit('PICK_MOVIE', picked_movie_id)
  }
}

export default {
  namespaced: true, 
  state,
  mutations,
  actions
}