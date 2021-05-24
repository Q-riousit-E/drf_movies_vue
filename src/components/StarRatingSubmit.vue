<template>
  <div class="my-rater-container d-flex flex-column justify-content-center align-items-center">
    <transition name="slide" mode="out-in">
      <h5 v-if="!mySimpleRatingFromStore">Rate This Movie</h5>
      <h5 v-else>This Movie Rated</h5>
    </transition>
    <div id="rater"></div>
    <transition name="fade">
      <button class="cancel-rating-btn" v-if="mySimpleRatingFromStore" @click="simpleRatingDelete">X</button>
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
  setup() {
    // init
    const store = useStore()
    const route = useRoute()

    // set picked movie
    const setPickedMovie = () => {
      store.dispatch('movies/pickMovie', route.params.movie_id)
    }
    setPickedMovie()

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

    // initilize rater
    onMounted(() => {
      myRater = rater({
        element:document.querySelector("#rater"),
        rateCallback:function rateCallback(rating, done) {
            this.setRating(rating)

            // send request to db to update my simple rating
            store.dispatch('movies/updateSimpleRating', { rating, movie_id: route.params.movie_id })
            done(); 
        },
        starSize:32,
        step:0.5
      })
      myRater.setRating(mySimpleRatingFromStore.value)
    })

    return {
      mySimpleRatingFromStore,
      simpleRatingDelete,
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
</style>