<template>
<div>
  <nav class="navbar navbar-expand-lg navbar-dark my-navbar">
    <div class="navbar-container container-fluid">
      <router-link :to="{ name: 'Home' }" class="my-brand navbar-brand">Movie Talk</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav d-flex justify-content-between align-items-center" style="width: 100%;">
          <!-- left-side empty div for layout -->
          <div></div>

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
            <SearchedMovie 
              v-for="(movie, idx) in searchedMovies" 
              :key="idx" 
              :movie="movie"
            />
          </div>

          <!-- accounts (right) -->
          <!-- if logged in -->
          <div class="nav-accounts">
            <div v-if="decodedToken">
              <div class='d-flex'>
                <li class="nav-item dropdown">
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
                    <li><button class="dropdown-item" @click="handleLogout">Logout</button></li>
                  </ul>
                </li>
              </div>
            </div>
            <!-- if not logged in -->
            <div v-else>
              <div class="d-flex">
                <li class="nav-item">
                  <button class="nav-link auth-btn" @click="handleLoginClick">Login</button>
                </li>
                <li class="nav-item">
                  <button class="nav-link auth-btn" @click="handleSignupClick">Signup</button>
                </li>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  </nav>
  <AuthForm 
    v-if="authFormOn" 
    :isLoginForm="isLoginForm" 
    @cancelAuth="handleCancelAuth"
    @changeToSignup="handleChangeToSignup"
    @changeToLogin="handleChangeToLogin"
  />
</div>
</template>

<script>
import AuthForm from '@/components/AuthForm.vue'
import SearchedMovie from '@/components/SearchedMovie.vue'

import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import axios from 'axios'

export default {
  name: 'MainNav',
  components: {
    AuthForm,
    SearchedMovie
  },
  setup() {
    // Get user info from store
    const store = useStore()
    const decodedToken = computed(() => store.state.auth.decodedToken)

    // Login, Signup
    const authFormOn = ref(false)
    const isLoginForm = ref(true)

    const handleLoginClick = () => {
      authFormOn.value = true
      isLoginForm.value = true
    }
    const handleSignupClick = () => {
      authFormOn.value = true
      isLoginForm.value = false
    }
    const handleCancelAuth = () => {
      authFormOn.value = false
    }
    const handleChangeToSignup = () => {
      console.log('changed in mainnav')
      isLoginForm.value = false
    }
    const handleChangeToLogin = () => {
      isLoginForm.value = true
    }

    // Logout
    const handleLogout = () => {
      store.dispatch('auth/logout')
    }

    // Search Movies
    const searchedMovies = ref([])

    onMounted(() => {
      // Grab elements
      const searchInput = document.querySelector("#search-input");
      const myPopover = document.querySelector(".my-popover");
      const searchLabel = document.querySelector(".search-label");
      const xIconDiv = document.querySelector(".x-icon");
      const spinnerIcondiv = document.querySelector(".spinner-icon");

      // clicking searchLabel focuses searchInput
      searchLabel.addEventListener("click", () => {
        searchInput.focus();
      });

      // focus and focusout events on searchInput
      searchInput.addEventListener("focus", () => {
        if (searchedMovies.value.length) {
          myPopover.classList.add("show-popover");
          myPopover.classList.remove("invisible");
          searchInput.classList.add("input-with-popover");
        }
      });
      searchInput.addEventListener("focusout", () => {
        // use setTimeOut so a tag redirecting works for searched items
        setTimeout(() => {
          // myPopover.classList.remove("show-popover");
          // myPopover.classList.add("invisible");
          searchInput.classList.remove("input-with-popover");
        }, 100);
      });

      // x-icon click event
      xIconDiv.addEventListener("click", () => {
        searchInput.value = "";
        searchedMovies.value = []
        myPopover.classList.remove("show-popover");
        myPopover.classList.add("invisible");
        searchInput.classList.remove("input-with-popover");
        xIconDiv.classList.add("invisible");
        spinnerIcondiv.classList.add("invisible");
        searchLabel.classList.remove("invisible");
      })

      // initiate search via ajax (wait 0.5s until user finishes typing)
      let timeout = null;
      searchInput.addEventListener("keyup", e => {
        // start spinner icon and remove search icon
        xIconDiv.classList.add("invisible");
        spinnerIcondiv.classList.remove("invisible");
        searchLabel.classList.add("invisible");
        
        // clear timeout if change within 0.5s
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          // delete all previous data in popover
          [...document.querySelectorAll(".popover-items")].forEach(item => {
            item.remove();
          });

          // if search_word != empty -> request search
          if (e.target.value) {
            searchRequest(e.target.value);
          } else {
            myPopover.classList.remove("show-popover");
            myPopover.classList.add("invisible");
            searchInput.classList.remove("input-with-popover");
            xIconDiv.classList.add("invisible");
            spinnerIcondiv.classList.add("invisible");
            searchLabel.classList.remove("invisible");
          }
        }, 500);
      })

      // axios request with the query
      function searchRequest(query) {
        console.log("seach for: ", query)
        axios({
          method: 'get',
          url: "http://localhost:8000/api/v1/movie/search/",
          params: {'q': query},
        })
          .then((res) => {
            showSearchResults(res.data)
          })
          .catch((err) => {
            console.log(err)
          })
      }

      // show Search Results
      function showSearchResults(data) {
        console.log(data)
        searchedMovies.value = data

        // show myPopover
        if (data.length) {
          myPopover.classList.add("show-popover");
          myPopover.classList.remove("invisible");
          searchInput.classList.add("input-with-popover");
          searchLabel.classList.add("invisible");
          xIconDiv.classList.remove("invisible");
          spinnerIcondiv.classList.add("invisible");
        } else {
          searchInput.classList.remove("input-with-popover");
          myPopover.classList.remove("show-popover");
          myPopover.classList.add("invisible");
          spinnerIcondiv.classList.add("invisible");
          searchLabel.classList.remove("invisible");

        }
      }
    })
    
    return {
      // auth
      decodedToken,
      authFormOn, isLoginForm,
      handleLoginClick, handleSignupClick,
      handleCancelAuth,
      handleChangeToSignup, handleChangeToLogin,
      handleLogout,
      
      // search bar
      searchedMovies
    }
  },
}
</script>

<style scoped>
.my-navbar {
  height: 5.5vh;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-container {
  margin: 0;
  padding: 0;
}

.my-brand {
  padding-left: 3vw;
}

.auth-btn {
  background: none;
  border: none;
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
  animation: searchColorToggle 0.5s ease infinite;
}

@keyframes searchColorToggle {
  0% {
    color: gray;
  }
  50% {
    color: black;
  }
  100% {
    color: gray;
  }
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
  width: 24vw;
}

#check:checked+.search-box > input{
  opacity: 1;
}

.my-popover {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  top: 2.7rem;
  width: 24vw;
  height: 0;
  border-radius: 0 0 0.7rem 0.7rem;
  background-color: purple;
  color: black;
  transition: 0.5s;
  overflow-x: hidden;
  overflow-y: scroll;
  z-index: 10;
}

.show-popover {
  height: initial;
  max-height: 52vh;
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
.nav-accounts {
  padding-right: 3vw;
}

.profile-dropdown {
  min-width: 100%;
  z-index: 60;
}

.profile-img {
  height: 3vh;
  border-radius: 50%;
}

</style>