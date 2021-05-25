import axios from 'axios'

const moviesURL = 'http://localhost:8000/api/v1/movies/'

const state = {
  moviesObj: null,
  picked_movie: null,
  currMovieGenre: 'sci_fi',
  simpleRating: 0
}

const mutations = {
  SET_MOVIES(state, moviesObj) {
    state.moviesObj = moviesObj
  },
  SET_PICKED_MOVIE(state, movie) {
    state.picked_movie = movie
  },
  SET_CURR_MOVIE_GENRE(state, currMovieGenre) {
    state.currMovieGenre = currMovieGenre
  },

  // MovieDetail.vue
  SET_SIMPLE_RATING(state, rating) {
    state.simpleRating = rating
  },
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
      url: moviesURL + picked_movie_id + '/'
    })
    .then((res) => {
      commit('SET_PICKED_MOVIE', res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  },
  changeCurrMovieGenre({ commit }, currMovieGenre) {
    commit('SET_CURR_MOVIE_GENRE', currMovieGenre)
  },

  // MovieDetail.vue
  readCurrSimpleRating({ commit, rootState }, movie_id) {
    axios({
      method: 'get',
      url: moviesURL + `${movie_id}/simple_rating/`,
      headers: {
        Authorization: 'JWT ' + rootState.auth.token
      }
    })
      .then((res) => {
        commit('SET_SIMPLE_RATING', res.data.rating)
      })
      .catch((err) => {
        commit('SET_SIMPLE_RATING', 0)
        console.log(err)
      })
  },
  updateSimpleRating({ commit, rootState }, { rating, movie_id }) {
    if (rootState.movies.simpleRating) { 
      // PUT request if simple rating already exists
      axios({
        method: 'put',
        url : moviesURL + `${movie_id}/simple_rating/`,
        headers: {
          Authorization: 'JWT ' + rootState.auth.token
        },
        data: {
          rating
        }
      })
        .then((res) => {
          commit('SET_SIMPLE_RATING', res.data.rating)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      // POST request if not
      axios({
        method: 'post',
        url : moviesURL + `${movie_id}/simple_rating/`,
        headers: {
          Authorization: 'JWT ' + rootState.auth.token
        },
        data: {
          rating
        }
      })
        .then((res) => {
          commit('SET_SIMPLE_RATING', res.data.rating)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  deleteSimpleRating({ commit, rootState }, movie_id) {
    axios({
      method: 'delete',
      url : moviesURL + `${movie_id}/simple_rating/`,
      headers: {
        Authorization: 'JWT ' + rootState.auth.token
      } 
    })
      .then((res) => {
        commit('SET_SIMPLE_RATING', 0)
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