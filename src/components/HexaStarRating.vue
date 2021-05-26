<template>
<div class="container mt-5"></div>
<div class="row" style="color: black;">
  <div class="col-6 star-container">
    <div>Originality</div>
    <div id="rater1"></div>
  </div>
  <div class="col-6 star-container">
    <div>Plot</div>
    <div id="rater2"></div>
  </div>
  <div class="col-6 star-container">
    <div>Cinematography</div>
    <div id="rater3"></div>
  </div>
  <div class="col-6 star-container">
    <div>Music Score</div>
    <div id="rater4"></div>
  </div>
  <div class="col-6 star-container">
    <div>Characters</div>
    <div id="rater5"></div>
  </div>
  <div class="col-6 star-container">
    <div>Entertainment Value</div>
    <div id="rater6"></div>
  </div>
</div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

import rater from 'rater-js'

export default {
  name: 'HexaStarRating',
  emits: ['setHexaData'],
  setup(props, { emit }) {
    const store = useStore()
    const hexaData = computed(() => store.state.movies.myHexa)
    let rater1, rater2, rater3, rater4, rater5, rater6

    onMounted(() => {
      rater1 = rater({
        element:document.querySelector("#rater1"),
        starSize: 32,
        step: 0.5,
        rateCallback:function rateCallback(rating, done) {
          this.setRating(rating)
          emit('setHexaData', {rater:'originality', value: rating})
          done(); 
        }
      })
      rater2 = rater({
        element:document.querySelector("#rater2"),
        starSize: 32,
        step: 0.5,
        rateCallback:function rateCallback(rating, done) {
          this.setRating(rating)
          emit('setHexaData', {rater:'plot', value: rating})
          done(); 
        }
      })
      rater3 = rater({
        element:document.querySelector("#rater3"),
        starSize: 32,
        step: 0.5,        
        rateCallback:function rateCallback(rating, done) {
          this.setRating(rating)
          emit('setHexaData', {rater:'cinematography', value: rating})
          done(); 
        }
      })
      rater4 = rater({
        element:document.querySelector("#rater4"),
        starSize: 32,
        step: 0.5,        
        rateCallback:function rateCallback(rating, done) {
          this.setRating(rating)
          emit('setHexaData', {rater:'music_score', value: rating})
          done(); 
        }
      })
      rater5 = rater({
        element:document.querySelector("#rater5"),
        starSize: 32,
        step: 0.5,        
        rateCallback:function rateCallback(rating, done) {
          this.setRating(rating)
          emit('setHexaData', {rater:'characters', value: rating})
          done(); 
        }
      })
      rater6 = rater({
        element:document.querySelector("#rater6"),
        starSize: 32,
        step: 0.5,        
        rateCallback:function rateCallback(rating, done) {
          this.setRating(rating)
          emit('setHexaData', {rater:'entertainment_value', value: rating})
          done(); 
        }
      })

      // initial data setting
      setTimeout(() => {
        rater1.setRating(hexaData.value.originality)
        rater2.setRating(hexaData.value.plot)
        rater3.setRating(hexaData.value.cinematography)
        rater4.setRating(hexaData.value.music_score)
        rater5.setRating(hexaData.value.characters)
        rater6.setRating(hexaData.value.entertainment_value)
      })
    })

    return {
      hexaData,
    }
  }
}
</script>

<style scoped>
#rater1 {
  color: blue;
}

.star-container {
  margin-top: 2rem;
}

.star-container div {
  font-size: 2rem;
}
</style>