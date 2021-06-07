import axios from 'axios'

const localUrl = 'http://localhost:8000'
// const url = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : localUrl
// const url = 'https://movietalk.site'
const url = 'https://3.37.64.174'

const moviesURL = url + '/api/v1/movies/'
const articlesURL = url + '/api/v1/articles/'

const state = {
  moviesObj: null,
  picked_movie: {
    "id": 96,
    "star_average": 4.3,
    "simple_rating_counts": {
      "0.5": 3,
      "1.0": 0,
      "1.5": 0,
      "2.0": 3,
      "2.5": 4,
      "3.0": 4,
      "3.5": 4,
      "4.0": 8,
      "4.5": 38,
      "5.0": 36
    },
    "detailed_ratings_average": {
      "originality_average": 3.6,
      "plot_average": 4,
      "characters_average": 3.9,
      "cinematography_average": 3.1,
      "music_score_average": 3.8,
      "entertainment_value_average": 4
    },
    "genre_names": [
      "Comedy",
      "Fantasy",
      "Horror",
      "Science Fiction"
    ],
    "adult": false,
    "title": "The Rocky Horror Picture Show",
    "overview": "Sweethearts Brad and Janet, stuck with a flat tire during a storm, discover the eerie mansion of Dr. Frank-N-Furter, a transvestite scientist. As their innocence is lost, Brad and Janet meet a houseful of wild characters, including a rocking biker and a creepy butler. Through elaborate dances and rock songs, Frank-N-Furter unveils his latest creation: a muscular man named 'Rocky'.",
    "poster_path1": "https://image.tmdb.org/t/p/original//3pyE6ZqDbuJi7zrNzzQzcKTWdmN.jpg",
    "poster_path2": "https://image.tmdb.org/t/p/original//8QCNX4oxfO7xyASvJ0fnTFrqXsC.jpg",
    "poster_path3": "https://image.tmdb.org/t/p/original//5ycpwyUkYBwm2VFoE3TkP3OtuFw.jpg",
    "poster_path4": "https://image.tmdb.org/t/p/original//njfcrSFJeJAL5EUJ96AVTIeD7JV.jpg",
    "trailer_path": "https://youtube.com/embed/4plqh6obZW4",
    "release_date": "1975-08-14",
    "director_name": "Jim Sharman",
    "cast1_name": "Tim Curry",
    "cast2_name": "Susan Sarandon",
    "cast3_name": "Barry Bostwick"
  },
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
  },
  allReviewsForMovie: []
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

  // Get all Movie Reviews
  SET_ALL_REVIEWS_FOR_MOVIE(state, data) {
    state.allReviewsForMovie = data
  }
}

const actions = {
  getMovies({ commit }) {
    axios({
      method: 'get',
      url: url + '/api/v1/movies/index/'
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
        commit('SET_MY_COMMENT', '')
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
  },

  // Get All Reviews for Movie
  getReviewsForMovie({ commit }, movie_id) {
    console.log(movie_id)
    axios({
      method: 'get',
      url: moviesURL + `${movie_id}/review-sets/`,
    })
      .then((res) => {
        commit('SET_ALL_REVIEWS_FOR_MOVIE', res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },

  // Comment comment CRUD
  createComment({ commit, rootState }, {article_id, content}) {
    console.log(article_id)
    axios({
      method: 'post',
      url: articlesURL + `${article_id}/comments/`,
      data: {
        content
      },
      headers: {
        Authorization: 'JWT ' + rootState.auth.token
      },
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  deleteComment({ commit, rootState }, commentComment_id) {
    axios({
      method: 'delete',
      // url: `http://localhost:8000/api/v1/comments/${commentComment_id}/`,
      url: url +`/api/v1/comments/${commentComment_id}/`,
      headers: {
        Authorization: 'JWT ' + rootState.auth.token
      }
    })
      .then((res) => {
        console.log(res)
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