<template>
  <div v-if="token">
    <h1>User is already logged in</h1>
  </div>
  <div v-else class="wrapper fadeInDown" >
    <div id="formContent">
      <!-- Tabs Titles -->
      <h2 class="active"> Signup </h2>

      <!-- Login Form -->
      <form @submit="submitLogin">
        <input type="text" id="login" class="fadeIn second" name="login" placeholder="login" v-model="credentials.username">
        <input type="password" id="password" class="fadeIn third" name="password" placeholder="password" v-model="credentials.password">
        <input type="password" id="passwordConfirmation" class="fadeIn third" name="passwordConfirmation" placeholder="password confirmation" v-model="credentials.passwordConfirmation" @keyup.enter="submitLogin">
        <input type="submit" class="fadeIn fourth" value="Signup">
      </form>

      <!-- Remind Passowrd -->
      <div id="formFooter">
        <a class="underlineHover" href="#">Forgot Password?</a>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Signup',

  setup() {
    // Vuex: Check if user is logged in
    const store = useStore()
    const token = computed(() => store.state.auth.token)

    // Login
    const credentials = ref({
      username: 'admin1',
      password: 'asdfasdfqwer1',
      passwordConfirmation: 'asdfasdfqwer1',
    })
    
    const submitLogin = async (e) => {
      e.preventDefault()
      store.dispatch('auth/signup', credentials.value)
    }

    return {
      token,
      credentials, submitLogin
    }
  }
}
</script>

<style>

</style>