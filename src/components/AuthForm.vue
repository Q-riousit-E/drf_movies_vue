<template>
<div class="authForm" @click="handleCancelAuth">
<!-- <transition name="pushRight" mode="out-in"> -->
  <!-- Login Form -->
  <div v-if="isLoginForm" class="wrapper fadeInDown" >
    <div id="formContent">
      <!-- Tabs Titles -->
      <h2 class="sign-in active"> Login </h2>

      <!-- Login Form -->
      <form @submit="submitLogin">
        <input type="text" id="login" class="fadeIn second" name="login" placeholder="username" v-model="credentials.username">
        <input type="password" id="password" class="fadeIn third" name="password" placeholder="password" v-model="credentials.password" @keyup.enter="submitLogin">
        <input type="submit" class="fadeIn fourth mt-3" value="Log In">
      </form>

      <!-- Remind Passowrd -->
      <div id="formFooter" class="d-flex justify-content-evenly">
        <a class="underlineHover" href="#" @click="changeToSignup">Signup</a>
        <a class="underlineHover" href="#">Forgot Password?</a>
      </div>

    </div>
  </div>

  <!-- Signup Form -->
  <div v-else class="wrapper fadeInDown" >
    <div id="formContent">
      <!-- Tabs Titles -->
      <h2 class="sign-in active"> Signup </h2>

      <!-- Login Form -->
      <form @submit="submitSignup">
        <input type="text" id="login" class="fadeIn second" name="login" placeholder="username" v-model="credentials.username">
        <input type="password" id="password" class="fadeIn third" name="password" placeholder="password" v-model="credentials.password">
        <input type="password" id="passwordConfirmation" class="fadeIn third" name="passwordConfirmation" placeholder="password confirmation" v-model="credentials.passwordConfirmation" @keyup.enter="submitLogin">
        <input type="submit" class="fadeIn fourth" value="Signup">
      </form>

      <!-- Remind Passowrd -->
      <div id="formFooter">
        <p>Already have an account? <span class="login-span" @click="changeToLogin">Login</span></p>
      </div>

    </div>
  </div>
<!-- </transition> -->
</div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'AuthForm',
  props: ['isLoginForm'],
  emits: ['cancelAuth', 'changeToSignup', 'changeToLogin'],
  setup(props, { emit }) {
    // init
    const store = useStore()

    // Auth form Events
    const handleCancelAuth = (e) => {
      const authFormWrapper = document.querySelector('.wrapper')
      if (authFormWrapper === e.target) {
        console.log('clicked outside')
        emit('cancelAuth')
      }
    }

    const changeToSignup = (e) => {
      console.log('change to signup', e.target)
      emit('changeToSignup')
    }

    const changeToLogin = () => {
      emit('changeToLogin')
    }

    // Auth
    const isLoginForm = computed(() => props.isLoginForm)
    const credentials = ref({
      username: '',
      password: '',
      passwordConfirmation: '',
    })

    const submitLogin = async (e) => {
      e.preventDefault()
      store.dispatch('auth/login', credentials.value)
      emit('cancelAuth')
    }
    const submitSignup = async (e) => {
      e.preventDefault()
      store.dispatch('auth/signup', credentials.value)
      emit('changeToLogin')
    }

    return {
      handleCancelAuth, changeToSignup, changeToLogin,
      isLoginForm,
      credentials,
      submitLogin, submitSignup
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins');

.authForm {
  z-index: 200;
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: rgb(0, 0, 0, 0.75);
}

.login-span {
  color: #609ae9;
}

/* BASIC */
body {
  font-family: "Poppins", sans-serif;
  height: 100vh;
}

a {
  color: #92badd;
  display:inline-block;
  text-decoration: none;
  font-weight: 400;
}

.sign-in {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display:inline-block;
  margin: 40px 8px 10px 8px; 
  color: #cccccc;
}



/* STRUCTURE */
.wrapper {
  z-index: 300;
  display: flex;
  align-items: center;
  flex-direction: column; 
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}

#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  text-align: center;
}

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}



/* TABS */
h2.inactive {
  color: #cccccc;
}

h2.active {
  color: #0d0d0d;
  border-bottom: 2px solid #5fbae9;
}



/* FORM TYPOGRAPHY*/

input[type=button], input[type=submit], input[type=reset]  {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 1rem;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover  {
  background-color: #39ace7;
}

input[type=button]:active, input[type=submit]:active, input[type=reset]:active  {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=text],
input[type=password] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type=text]:focus,
input[type=password]:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

input[type=text]:placeholder,
input[type=password]:placeholder {
  color: #cccccc;
}



/* ANIMATIONS */

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@-moz-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

.fadeIn {
  opacity:0;
  -webkit-animation:fadeIn ease-in 1;
  -moz-animation:fadeIn ease-in 1;
  animation:fadeIn ease-in 1;

  -webkit-animation-fill-mode:forwards;
  -moz-animation-fill-mode:forwards;
  animation-fill-mode:forwards;

  -webkit-animation-duration:1s;
  -moz-animation-duration:1s;
  animation-duration:1s;
}

.fadeIn.first {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #56baed;
  content: "";
  transition: width 0.2s;
}

.underlineHover:hover {
  color: #0d0d0d;
}

.underlineHover:hover:after{
  width: 100%;
}

/* Transition */
.pushRight-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}
.pushRight-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
.pushRight-enter-active,
.pushRight-leave-active {
  transition: all 0.5s ease-in;
}
</style>