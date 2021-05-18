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
    const token = computed(() => store.state.auth.token)

    // Logout
    const onClickLogout = () => {
      store.dispatch('auth/logout')
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