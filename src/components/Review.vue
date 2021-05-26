<template>
<div class="review-inner-container">
  <div class="user-info-container d-flex justify-content-between align-items-center">
    <p><b>{{ userData.username }}</b></p>
    <p><span style="color: rgb(241 201 71); font-size: 1.2rem;">★</span> <b> x {{ userData.simple_rating }}</b> </p>
  </div>
  <hr class="m-0">
  <div class="user-rating-container d-flex align-items-center">
    <div v-if="userData.article" class="comment-section d-flex flex-column justify-content-between" :class="'cols-'+ colCnt">
      <p>{{ userData.article.content }}</p>
      <!-- Likes Section -->
      <div>
        <span>
          <i v-if="userData.comment_count" class="fas fa-thumbs-up"></i>
          <i v-else class="far fa-thumbs-up"></i>
          <span>{{ userData.comment_count }}</span>
        </span>
        <span class="mx-4">
          <i v-if="userData.comment_count" class="fas fa-comment-dots"></i>
          <i v-else class="far fa-comment-dots"></i>
          <span>{{ userData.comment_count }}</span>
        </span>
      </div>

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
  background-color: rgb(68 68 68);
  border-radius: 5px;
  height: 32vh;
  -webkit-box-shadow: 0px 8px 24px 5px rgba(0,0,0,0.27); 
  box-shadow: 0px 8px 24px 5px rgba(0,0,0,0.27);
}

.user-info-container {
  /* border: 1px solid black; */
  color: white;
  padding: 1rem 2rem 1rem 2rem;
}

.user-rating-container {
  padding: 0.4rem 2rem 0 2rem;
}

.comment-section {
  padding-top: 1rem;
  width: 50%;
  height: 22vh;
  color: white;
  overflow-y: auto;
  overflow-wrap: break-word;
  /* border: 1px solid black; */
}

.hexa-section {
  width: 50%;
  height: 22vh;
  /* border: 1px solid black; */
}

.cols-1 {
  width: 100%;
}
</style>