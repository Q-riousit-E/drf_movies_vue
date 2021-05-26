import axios from 'axios'

const moviesURL = 'http://localhost:8000/api/v1/movies/'
const articlesURL = 'http://localhost:8000/api/v1/articles/'

const state = {
  moviesObj: null,
  picked_movie: null,
  currMovieGenre: 'sci_fi',
  simpleRating: 0,
  suggested_movies: null,
  myComment: '',
  myHexa: {
    originality: 0,
    plot: 0,
    cinematography: 0,
    music_score: 0,
    characters: 0,
    entertainment_value: 0,
  }
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

  // Suggested Movies
  SET_SUGGESTED_MOVIES(state, movies) {
    state.suggested_movies = movies
  },

  // Comments
  SET_MY_COMMENT(state, comment) {
    state.myComment = comment
  },
  UPDATE_MY_COMMENT(state, comment) {
    state.myComment = comment
  },

  // Hexa Rating
  SET_MY_HEXA(state, hexa) {
    state.myHexa = hexa
  },
  UPDATE_MY_HEXA(state, hexa) {
    state.myHexa = hexa
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
      url: moviesURL + `${movie_id}/simple-rating/`,
      headers: {
        Authorization: 'JWT ' + rootState.auth.token
      }
    })
      .then((res) => {
        commit('SET_SIMPLE_RATING', res.data.rating)
      })
      .catch((err) => {
        commit('SET_SIMPLE_RATING', 0)
      })
  },
  updateSimpleRating({ commit, rootState }, { rating, movie_id }) {
    if (rootState.movies.simpleRating) { 
      // PUT request if simple rating already exists
      axios({
        method: 'put',
        url : moviesURL + `${movie_id}/simple-rating/`,
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
        url : moviesURL + `${movie_id}/simple-rating/`,
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
      url : moviesURL + `${movie_id}/simple-rating/`,
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
  },

  // Movie Suggestion
  get_suggested_movies({ commit, rootState }) {
    if (rootState.auth.token) {
      axios({
        method: 'get',
        url: moviesURL + 'recommendation/',
        headers: {
          Authorization: 'JWT ' + rootState.auth.token
        }
      })
        .then((res) => {
          commit('SET_SUGGESTED_MOVIES', res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      axios({
        method: 'get',
        url: moviesURL + 'recommendation/',
      })
        .then((res) => {
          commit('SET_SUGGESTED_MOVIES', res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },

  // Movie Comments
  getMyComment({ commit, rootState }, movie_id) {
    axios({
      method: 'get',
      url: moviesURL + `${movie_id}/my-article/`,
      headers: {
        Authorization: 'JWT ' + rootState.auth.token
      }
    })
      .then((res) => {
        commit('SET_MY_COMMENT', res.data)
      })
      .catch((err) => {
        commit('SET_MY_COMMENT', null)
      })
  },
  updateComment({ commit, rootState }, { movie_id, comment }) {
    if (rootState.movies.myComment) {
      const myComment = rootState.movies.myComment
      // PUT request
      console.log('update comment')
      axios({
        method: 'put',
        url: articlesURL + `${myComment.id}/`,
        headers: {
          Authorization: 'JWT ' + rootState.auth.token
        },
        data: {
          title: 'no title',
          content: comment
        }
      })
        .then((res) => {
          commit('UPDATE_MY_COMMENT', res.data)
        })
        .catch((err) => {
          console.log(err)
        })

    } else {
      // POST request
      console.log('create comment')
      axios({
        method: 'post',
        url: moviesURL + `${movie_id}/articles/`,
        headers: {
          Authorization: 'JWT ' + rootState.auth.token
        },
        data: {
          title: 'no title',
          content: comment
        }
      })
        .then((res) => {
          commit('UPDATE_MY_COMMENT', res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  deleteComment({ commit, rootState }) {
    const myComment = rootState.movies.myComment

    axios({
      method: 'delete',
      url: articlesURL + `${myComment.id}/`,
      headers: {
        Authorization: 'JWT ' + rootState.auth.token
      }
    })
      .then((res) => {
        commit('UPDATE_MY_COMMENT', res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },

  // Movie Hexa Ratings
  getMyHexa({ commit, rootState }, movie_id) {
    axios({
      method: 'get',
      url: moviesURL + `${movie_id}/detailed-rating/`,
      headers: {
        Authorization: 'JWT ' + rootState.auth.token
      }
    })
      .then((res) => {
        commit('SET_MY_HEXA', res.data)
      })
      .catch((err) => {
        commit('SET_MY_HEXA', {
          originality: 0,
          plot: 0,
          cinematography: 0,
          music_score: 0,
          characters: 0,
          entertainment_value: 0,
        })
      })
  },
  updateHexa({ commit, rootState }, { movie_id, hexaData }) {
    const submitData = {
      originality: hexaData.originality,
      plot: hexaData.plot,
      cinematography: hexaData.cinematography,
      music_score: hexaData.music_score,
      characters: hexaData.characters,
      entertainment_value: hexaData.entertainment_value,
    }
    console.log(submitData)
    if (rootState.movies.myHexa.originality) {
      // PUT request
      console.log('update hexaData')
      console.log(hexaData)
      axios({
        method: 'put',
        url: moviesURL + `${movie_id}/detailed-rating/`,
        headers: {
          Authorization: 'JWT ' + rootState.auth.token
        },
        data: submitData
      })
        .then((res) => {
          console.log(res.data)
          commit('UPDATE_MY_HEXA', res.data)
        })
        .catch((err) => {
          console.log(err)
        })

    } else {
      // POST request
      axios({
        method: 'post',
        url: moviesURL + `${movie_id}/detailed-rating/`,
        headers: {
          Authorization: 'JWT ' + rootState.auth.token
        },
        data: submitData
      })
        .then((res) => {
          commit('UPDATE_MY_HEXA', res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  deleteHexa({ commit, rootState }, movie_id) {
    const myHexa = rootState.movies.myHexa
    axios({
      method: 'delete',
      url: moviesURL + `${movie_id}/detailed-rating/`,
      headers: {
        Authorization: 'JWT ' + rootState.auth.token
      }
    })
      .then((res) => {
        console.log(res.data)
        commit('UPDATE_MY_HEXA', res.data)
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