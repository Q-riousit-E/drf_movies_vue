import { createStore, createLogger } from 'vuex'

import createPersistedState from "vuex-persistedstate";

import auth from './modules/auth.js'
import movies from './modules/movies.js'

export default createStore({
  modules: {
    auth,
    movies
  },

  plugins: [
    createLogger(),
    createPersistedState()
  ]
})
