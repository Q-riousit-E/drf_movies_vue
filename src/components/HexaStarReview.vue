<template>
<div class="row mt-3" style="color: white;">
  <div class="col-6 star-container">
    <div>Originality</div>
    <div :id="'rater1-'+userData.user_id"></div>
  </div>
  <div class="col-6 star-container">
    <div>Plot</div>
    <div :id="'rater2-'+userData.user_id"></div>
  </div>
  <div class="col-6 star-container">
    <div>Cinematography</div>
    <div :id="'rater3-'+userData.user_id"></div>
  </div>
  <div class="col-6 star-container">
    <div>Music Score</div>
    <div :id="'rater4-'+userData.user_id"></div>
  </div>
  <div class="col-6 star-container">
    <div>Characters</div>
    <div :id="'rater5-'+userData.user_id"></div>
  </div>
  <div class="col-6 star-container">
    <div>Entertainment Value</div>
    <div :id="'rater6-'+userData.user_id"></div>
  </div>
</div>
</template>#29a2cc

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'

import rater from 'rater-js'

export default {
  name: 'HexaStarRating',
  props: ['userData'],
  emits: ['setHexaData'],
  setup(props, { emit }) {
    const store = useStore()
    const userData = computed(() => props.userData)
    let rater1, rater2, rater3, rater4, rater5, rater6
    let starSize = 13

    onMounted(() => {
      // give diffrent classname to each rater for identification
      rater1 = rater({
        element:document.querySelector(`#rater1-${userData.value.user_id}`),
        readOnly: true,
        starSize: starSize,
        step: 0.5,
        rateCallback:function rateCallback(rating, done) {
          done() 
        }
      })
      rater2 = rater({
        element:document.querySelector(`#rater2-${userData.value.user_id}`),
        readOnly: true,
        starSize: starSize,
        step: 0.5,
        rateCallback:function rateCallback(rating, done) {
          done() 
        }
      })
      rater3 = rater({
        element:document.querySelector(`#rater3-${userData.value.user_id}`),
        readOnly: true,
        starSize: starSize,
        step: 0.5,        
        rateCallback:function rateCallback(rating, done) {
          done() 
        }
      })
      rater4 = rater({
        element:document.querySelector(`#rater4-${userData.value.user_id}`),
        readOnly: true,
        starSize: starSize,
        step: 0.5,        
        rateCallback:function rateCallback(rating, done) {
          emit('setHexaData', {rater:'music_score', value: rating})
          done() 
        }
      })
      rater5 = rater({
        element:document.querySelector(`#rater5-${userData.value.user_id}`),
        readOnly: true,
        starSize: starSize,
        step: 0.5,        
        rateCallback:function rateCallback(rating, done) {
          done() 
        }
      })
      rater6 = rater({
        element:document.querySelector(`#rater6-${userData.value.user_id}`),
        readOnly: true,
        starSize: starSize,
        step: 0.5,        
        rateCallback:function rateCallback(rating, done) {
          done() 
        }
      })

      // initial data setting
      setTimeout(() => {
        rater1.setRating(userData.value.detailed.originality)
        rater2.setRating(userData.value.detailed.plot)
        rater3.setRating(userData.value.detailed.cinematography)
        rater4.setRating(userData.value.detailed.music_score)
        rater5.setRating(userData.value.detailed.characters)
        rater6.setRating(userData.value.detailed.entertainment_value)
      })
    })

    return {
      userData,
    }
  }
}
</script>

<style>
#rater1 {
  color: blue;
}

.star-container {
  margin-bottom: 1rem;
  padding: 0;
  text-align: center;
}

.star-container div {
  font-size: 0.9rem;
  color: rgb(188 188 188);
}

/* .star-rating {
  background: url('~@/assets/empty_star.svg') !important;
  position: relative;
  display: inline-block;
  background-position: 0 0;
  background-repeat: 0 0;
} */

.star-rating .star-value  {
  background: url('~@/assets/full_star3.svg');
  margin-bottom: 1rem;
  /* background-repeat: repeat-x;
  position: absolute;
  height: 100%;
  background-size: 10px;
  width: 20%; */
}
</style>