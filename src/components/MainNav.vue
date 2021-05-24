<template>
<nav class="navbar navbar-expand-lg navbar-dark my-navbar">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">pjt</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav d-flex justify-content-between align-items-center" style="width: 100%;">
        <!-- left-side-->
        <div class='d-flex'>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Home' }">Home</router-link>
          </li>
        </div>

        <!-- Search (center)-->
        <input type="checkbox" id="check">
        <div class="search-box">
          <input id="search-input" type="text" placeholder="Search...">
          <label class="search-label" for="check"><i class="fas fa-search search-icon"></i></label>
          <div class="x-icon invisible"><i class="fas fa-times-circle"></i></div>
          <div class="spinner-icon invisible"><i class="fas fa-spinner fa-spin"></i></div>
        </div>
        <div class="my-popover invisible">
          <hr class="popover-hr">
        </div>

        <!-- accounts (right) -->
          <!-- if logged in -->
        <div v-if="decodedToken">
          <div class='d-flex'>
            <li class="nav-item dropdown me-3">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" type="button" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <!-- {% if user.profile_img %} -->
                <!-- <img class="profile-img me-2" src="{{ user.profile_img.url }}" alt="{{ user.username }}'s profile image"> -->
                <!-- {% endif %} -->
                {{ decodedToken.username }}
              </a>
              <ul class="dropdown-menu profile-dropdown" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">sth</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link class="dropdown-item" :to="{ name: 'Logout' }">Logout</router-link></li>
              </ul>
            </li>
          </div>
        </div>
        <!-- if not logged in -->
        <div v-else>
          <div class="d-flex">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Login' }">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Signup' }">Signup</router-link> 
            </li>
          </div>
        </div>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'MainNav',
  setup() {
    // Get user info from store
    const store = useStore()
    const decodedToken = computed(() => store.state.auth.decodedToken)

    watch(decodedToken, () => {
      console.log(decodedToken)
    })

    return {
      decodedToken
    }

  }
}
</script>

<style>
.my-navbar {
  height: 6vh;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.1);
}

/* searchbar */
.my-navbar input[type="checkbox"]{
  display: none;
}

.search-box {
  position: absolute;
  left: 50%;
  width: 3vh;
  height: 3vh;
  transform: translate(-50%);
  transition: 0.5s;
}

.search-box label {
  position: absolute;
  right: 0.5rem;
  width: 3vh;
  height: 3vh;
  line-height: 3vh;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  background-color: white;
  color: gray;
}

.search-box label:hover {
  color: black;
}

.search-box input {
  width: 100%;
  height: 100%;
  background-color: white;
  border: none;
  border-radius: 0.7rem;
  outline: none;
  padding-left: 1rem;
  color: black;
  transition: 0.5s;
  transition-property: opacity;
  opacity: 0;
}

.x-icon {
  position: absolute;
  color: gray;
  display: inline-block;
  right: 0.5rem;
  width: 3vh;
  height: 3vh;
  line-height: 3vh;
  text-align: center;
}

.x-icon:hover {
  color: black;
}

.spinner-icon {
  position: absolute;
  color: gray;
  display: inline-block;
  right: 0.5rem;
  width: 3vh;
  height: 3vh;
  line-height: 3vh;
  text-align: center;
}

.spinner-icon:hover {
  color: black;
}

.input-with-popover {
  border-radius: 0.7rem 0.7rem 0 0 !important;
}

#check:checked+.search-box {
  width: 25vw;
}

#check:checked+.search-box > input{
  opacity: 1;
}

.my-popover {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  top: 2.7rem;
  width: 25vw;
  height: 0;
  border-radius: 0 0 0.7rem 0.7rem;
  background-color: white;
  color: black;
  transition: 0.5s;
  overflow-x: hidden;
  overflow-y: scroll;
  z-index: 10;
}

.show-popover {
  height: initial;
  max-height: 40vh;
}

.popover-hr {
  width: 100%;
  margin: 0 auto;
}

.popover-items {
  display: flex;
  justify-content: left;
  align-items: center;
  text-decoration: none;
  z-index: 10;
}

.popover-items:hover {
  background-color: rgb(209, 209, 209);
}

/* accounts */
.profile-dropdown {
  min-width: 100%;
}

.profile-img {
  height: 3vh;
  border-radius: 50%;
}

</style>