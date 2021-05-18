import { createStore, createLogger } from 'vuex'

import createPersistedState from "vuex-persistedstate";

import auth from './modules/auth.js'

export default createStore({
  modules: {
    auth
  },

  plugins: [
    createLogger(),
    createPersistedState()
  ]
})
