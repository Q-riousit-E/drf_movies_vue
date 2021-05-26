<template>
  <div class="my-rater-container d-flex flex-column justify-content-center align-items-center">
    <transition name="slide" mode="out-in">
      <p class="my-rating-p" v-if="!mySimpleRatingFromStore">Rate This Movie</p>
      <p class="my-rating-p-rated" v-else>You rated this movie {{ mySimpleRatingFromStore === 1 ? mySimpleRatingFromStore + " star" : mySimpleRatingFromStore + " stars" }}</p>
    </transition>
    <div id="rater" class="star-rating" :class="{starShake: starShakeClass}"></div>
    <transition name="fade">
      <button class="cancel-rating-btn" v-if="mySimpleRatingFromStore && decodedToken" @click="simpleRatingDelete" @mouseover="showDeleteMessage" @mouseleave="onCancelMouseLeave">x</button>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import rater from 'rater-js'

export default {
  name: 'StarRatingSubmit',
  props: ['starShakeMotion'],
  emits: ['promptLogin'],
  setup(props, { emit }) {
    // init
    const store = useStore()
    const route = useRoute()
    const decodedToken = computed(() => store.state.auth.decodedToken)

    //// StarShake
    const starShakeClass = ref(false)
    watch(() => props.starShakeMotion, () => {
      if (props.starShakeMotion) {
        starShakeClass.value = true
        setTimeout(() => {
          starShakeClass.value = false
        }, 1000)
      }
    })
    
    // Login
    const promptLogin = () => {
      emit('promptLogin')
    }


    // simple rating CRUD
    const readCurrSimpleRating = () => {
      store.dispatch('movies/readCurrSimpleRating', route.params.movie_id)
    }
    readCurrSimpleRating()

    // star rater setup
    let myRater
    const mySimpleRatingFromStore = computed(() => store.state.movies.simpleRating)
    
    const simpleRatingDelete = () => {
      myRater.clear()
      console.log(route.params.movie_id)
      store.dispatch('movies/deleteSimpleRating', route.params.movie_id)
    }

    // hover event on X
    const showDeleteMessage = () => {
      document.querySelector('.my-rating-p-rated').innerText = 'Cancel your rating?'
    }

    const onCancelMouseLeave = () => {
      const messageP = document.querySelector('.my-rating-p-rated')
      if (messageP) {
        messageP.innerText = `You rated this movie ${ mySimpleRatingFromStore.value === 1 ? mySimpleRatingFromStore.value + " star" : mySimpleRatingFromStore.value + " stars" }`
      }
    }

    // Logging in & Logging out
    watch(decodedToken, () => {
      console.log('auth changed', decodedToken.value)
      readCurrSimpleRating()
    })

    watch(mySimpleRatingFromStore, () => {
      myRater.setRating(mySimpleRatingFromStore.value)
    })

    // initilize rater
    onMounted(() => {
      // add hover event 
      myRater = rater({
        element:document.querySelector("#rater"),
        rateCallback:function rateCallback(rating, done) {
          // const messageP = document.querySelector('.my-rating-p') || document.querySelector('.my-rating-p-rated')
          // if not logged in
          if (!decodedToken.value) {
            promptLogin()
          } else {
            this.setRating(rating)
  
            // send request to db to update my simple rating
            store.dispatch('movies/updateSimpleRating', { rating, movie_id: route.params.movie_id })
          }
          done(); 
        },
        onHover: function(currIndex, currentRating) {
          const messageP = document.querySelector('.my-rating-p') || document.querySelector('.my-rating-p-rated')
          if (decodedToken.value) {
            if (mySimpleRatingFromStore.value && currIndex !== currentRating) {
              messageP.innerText = `Change your rating to ${currIndex}?`
            } else if (mySimpleRatingFromStore.value && currentRating) {
              messageP.innerText = `You rated this movie ${ mySimpleRatingFromStore.value === 1 ? mySimpleRatingFromStore.value + " star" : mySimpleRatingFromStore.value + " stars" }`
            } else {
              messageP.innerText = `Rate this movie ${ currIndex === 1 ? currIndex + " star" : currIndex + " stars" }?`
            }
          } else {
              messageP.innerText = `Please Login`
          }
        },
        onLeave: function(currIndex, currentRating) {
          const messageP = document.querySelector('.my-rating-p') || document.querySelector('.my-rating-p-rated')
          if (mySimpleRatingFromStore.value && currentRating) {
            messageP.innerText = `You rated this movie ${ mySimpleRatingFromStore.value === 1 ? mySimpleRatingFromStore.value + " star" : mySimpleRatingFromStore.value + " stars" }`
          } else {
            messageP.innerText = 'Rate This Movie'
          }
        },
        starSize:32,
        step:0.5
      })
      setTimeout(() => {
        myRater.setRating(mySimpleRatingFromStore.value)
      }, 1000)
    })

    return {
      decodedToken,
      mySimpleRatingFromStore,
      simpleRatingDelete,
      showDeleteMessage, onCancelMouseLeave,
      starShakeClass
    }
  }
}
</script>

<style scoped>
.my-rater-container {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgb(60 62 65);
  border-radius: 5px;
  position: relative;
}

.my-rating-p,
.my-rating-p-rated {
  font-size: 1.1vw;
  margin-bottom: 0.5rem;
}

#rater {
  position: relative;
}

.cancel-rating-btn {
  position: absolute;
  transform: translate(97px, 18px);
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: rgb(32 32 32);
}

/* Transitions */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(90px, 18px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.slide-enter-active, 
.slide-leave-actice {
  transition: all 0.3s ease-in;
}

/* Star Shake Motion */
.starShake {
  animation: shake;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
</style>