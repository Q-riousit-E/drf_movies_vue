<template>
<div class="row all-reviews-background">
  <div 
    v-for="userData in allReviewsFromStore" 
    :key="userData.user_id"
    :id="'review-container-' + userData.user_id"
    class="review-container"
  >
    <Review :userData="userData" @updateReviewData="updateReviewData" />
  </div>
</div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import Review from '@/components/Review.vue'

import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"


export default {
  name: 'ReviewList',
  components: {
    Review
  },
  emits: ['updateReviewData'],
  setup(props, { emit }) {
    // Init
    const store = useStore()

    // Get all Movie Reviews from Store
    const allReviewsFromStore = computed(() => store.state.movies.allReviewsForMovie)

    // emit to update reviews
    const updateReviewData = () => {
      emit('updateReviewData')
    }

    // onMounted(() => {
    //   // Gsap animation on Reviews
    //   gsap.registerPlugin(ScrollTrigger)
    //   const allReviews = document.querySelectorAll('.review-container')
  
    //   allReviews.forEach((review) => {
    //     console.log(review)

    //     gsap.to(review), {
    //       ScrollTrigger: {
    //         trigger: review,
    //         scrub: true
    //       }
    //     }
    //   })

    // })

    return {
      allReviewsFromStore,
      updateReviewData
    }
  }
}
</script>

<style scoped>
.all-reviews-background {
  width: 100%;
  background-color: rgb(53 53 53);
  border-radius: 5px;
  margin: 0;
}

.review-container {
  height: 37vh;
  position: relative;
  margin: 0;
  padding: 0;
  /* background-color: gray; */
}
</style>