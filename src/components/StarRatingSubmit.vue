<template>
  <div class="my-rater-container d-flex flex-column justify-content-center align-items-center">
    <h5>Rate Movie</h5>
    <div id="rater"></div>
    <transition name="fade">
      <button class="cancel-rating-btn" v-if="myRating" @click="starRatingClear">X</button>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

import rater from 'rater-js'

export default {
  name: 'StarRatingSubmit',
  setup() {
    // star rater setup
    let myRater
    const myRating = ref(0)

    const starRatingClear = () => {
      myRater.clear()
      myRating.value = 0
    }

    // initilize rater
    onMounted(() => {
      myRater = rater({
        element:document.querySelector("#rater"),
        rateCallback:function rateCallback(rating, done) {
            this.setRating(rating); 
            myRating.value = rating
            done(); 
        },
        starSize:32,
        step:0.5
      })
    })

    return {
      myRating,
      starRatingClear,
    }
  }
}
</script>

<style>
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
</style>