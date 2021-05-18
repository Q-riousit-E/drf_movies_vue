<template>
  <div v-if="token">
    <button @click="onClickLogout">Logout</button>
  </div>
  <div v-else>
    <h1>User is not logged in</h1>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Logout',

  setup() {
    // Vuex: Check if user is logged in
    const store = useStore()
    // const { logged_in } = useState(['logged_in'])
    const token = computed(() => store.state.auth.token)


    // // Logout
    // const cookies = useCookies(['locale'])
    // const csrftoken = cookies.get('csrftoken')

    const onClickLogout = () => {
    //   axios({
    //     method: 'post',
    //     url: 'api/accounts/logout/',
    //     data: {csrftoken},
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //     .then((res) => {
    //       // console.log(res)
          store.dispatch('auth/logout')
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    }

    return {
      token,
      onClickLogout
    }
  }
}
</script>

<style>

</style>