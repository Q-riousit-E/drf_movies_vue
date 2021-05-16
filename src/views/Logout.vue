<template>
  <div v-if="auth_logged_in">
    <button @click="onClickLogout">Logout</button>
  </div>
  <div v-else>
    <h1>User is not logged in</h1>
  </div>
</template>

<script>
import axios from 'axios'

import { computed } from 'vue'
import { useStore } from 'vuex'
import { useCookies } from '@vueuse/integrations'
import { useState } from '@/helpers.js'

export default {
  name: 'Logout',

  setup() {
    // Vuex: Check if user is logged in
    const store = useStore()
    // const { logged_in } = useState(['logged_in'])
    const auth_logged_in = computed(() => store.state.auth.logged_in)


    // Logout
    const cookies = useCookies(['locale'])
    const csrftoken = cookies.get('csrftoken')

    const onClickLogout = () => {
      axios({
        method: 'post',
        url: 'api/accounts/logout/',
        data: {csrftoken},
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          // console.log(res)
          store.dispatch('auth/logout')
        })
        .catch((err) => {
          console.log(err)
        })
    }

    return {
      auth_logged_in,
      onClickLogout
    }
  }
}
</script>

<style>

</style>