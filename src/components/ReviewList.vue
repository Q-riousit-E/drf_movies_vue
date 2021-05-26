<template>
<div class="row all-reviews-background">
  <div 
    v-for="(userData, idx) in allReviewsFromStore" 
    :key="idx"
    :id="'review-container-' + userData.user_id"
    class="review-container"
  >
    <Review :userData="userData" />
  </div>
</div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import Review from '@/components/Review.vue'

export default {
  name: 'ReviewList',
  components: {
    Review
  },
  setup() {
    // Init
    const store = useStore()

    // Get all Movie Reviews from Store
    const allReviewsFromStore = computed(() => store.state.movies.allReviewsForMovie)

    return {
      allReviewsFromStore
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