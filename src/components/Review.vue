<template>
<div class="review-inner-container">
  <div class="user-info-container d-flex justify-content-between align-items-center px-3 py-1">
    <p><b>{{ userData.username }}</b></p>
    <p><span style="color: rgb(241 201 71); font-size: 1.2rem;">★</span> x {{ userData.simple_rating }} </p>
  </div>
  <hr class="m-0">
  <div class="user-rating-container d-flex align-items-center px-3">
    <div v-if="userData.article" class="comment-section" :class="'cols-'+ colCnt">
      {{ userData.article.content }}
    </div>
    <div v-if="userData.detailed?.originality" class="hexa-section" :class="'cols-'+ colCnt">
      <HexaStarReview :userData="userData"/>
    </div>
  </div>
</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

import HexaStarReview from '@/components/HexaStarReview.vue'

export default {
  name: 'Review',
  components: {
    HexaStarReview
  },
  props: ['userData'],
  setup(props) {
    const userData = computed(() => props.userData)
    const colCnt = ref(0)
    
    onMounted(() => {
      // console.log(userData.value.article)  // string
      // console.log(userData.value.detailed?.originality)     // proxy
      const reviewContainer = document.querySelector(`#review-container-${userData.value.user_id}`)

      // check if this review is one col or two
      if (userData.value.article) {
        colCnt.value += 1
      }
      if (userData.value.detailed?.originality) {
        colCnt.value += 1
      }

      // add col-3 to isOneCol and col-6 to not isOneCol
      if (colCnt.value === 1) { 
        reviewContainer.classList.add('col-3')
      } else {
        reviewContainer.classList.add('col-6')
      }
    })

    return {
      userData,
      colCnt
    }
  }
}
</script>

<style scoped>
.review-inner-container {
  margin: 2vh;
  border: 1px solid black;
  background-color: rgb(68, 68, 68);
}

.user-info-container {
  /* border: 1px solid black; */
}

.comment-section {
  width: 50%;
  height: 20vh;
  /* border: 1px solid black; */
}

.hexa-section {
  width: 50%;
  height: 20vh;
  /* border: 1px solid black; */
}

.cols-1 {
  width: 100%;
}
</style>