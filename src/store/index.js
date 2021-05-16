import { createStore, createLogger } from 'vuex'

import auth from './modules/auth.js'

export default createStore({
  modules: {
    auth
  },

  plugins: [
    createLogger()
  ]
})
