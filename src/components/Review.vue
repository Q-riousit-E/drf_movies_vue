<template>
<div class="review-inner-container">
  <div class="user-info-container d-flex justify-content-between align-items-center">
    <p><b>{{ userData.username }}</b></p>
    <p><span style="color: rgb(241 201 71); font-size: 1.2rem;">★</span> <b> x {{ userData.simple_rating }}</b> </p>
  </div>
  <hr class="m-0">
  <div class="user-rating-container">
    <div class="user-rating-inner-container d-flex align-items-center">
      <div v-if="userData.article" class="comment-section d-flex flex-column justify-content-between" :class="'cols-'+ colCnt">
        <p>{{ userData.article.content }}</p>
        <!-- comment's comment Section -->
        <div class="mt-4">
          <hr>
          <span class="mt-1">
            <i v-if="userData.article?.comment_count" class="fas fa-comment-dots" @click="toggleCommentComment"></i>
            <i v-else class="far fa-comment-dots" @click="toggleCommentComment"></i>
            <span class="ms-2">{{ userData.article?.comment_count }}</span>
            <div class="comment-comment-section" v-if="commentCommentToggled">
              <input class="comment-comment-input" type="text" @keyup.enter="submitCommentComment(userData.article.id)" v-model="commentCommentContent" placeholder=" Add a comment...">
              <transition-group name="list" tag="div" appear>
                <div v-for="commentComment in userData.article.comment_set" :key="commentComment.id" class="mb-3 commentComment-container">
                  <div class="comment-comment-info">
                    <span>{{ commentComment.username }}</span>
                    <span v-if="commentComment.user === decodedToken.user_id" style="color: gray;" @click="deleteCommentComment(commentComment.id)">x</span>                
                    <!-- <span style="font-size: 0.8rem;">{{ commentComment.created_at.substring(0, 9) }}</span> -->
                  </div>
                  <div class="d-flex justify-content-between">
                    <p>{{ commentComment.content }}</p>
                  </div>
                </div>
              </transition-group>
            </div>
          </span>
        </div>

      </div>
      <div v-if="userData.detailed?.originality" class="hexa-section" :class="'cols-'+ colCnt">
        <HexaStarReview :userData="userData"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

import HexaStarReview from '@/components/HexaStarReview.vue'
import { useStore } from 'vuex'

export default {
  name: 'Review',
  components: {
    HexaStarReview
  },
  props: ['userData'],
  emits: ['updateReviewData'],
  setup(props, { emit }) {
    // Init
    const store = useStore()
    const decodedToken = computed(() => store.state.auth.decodedToken)

    // Review
    const userData = computed(() => props.userData)
    const colCnt = ref(0)
    const commentCommentToggled = ref(false)
    const commentCommentContent = ref('')

    const toggleCommentComment = () => {
      commentCommentToggled.value = !commentCommentToggled.value
    }

    const submitCommentComment = (article_id) => {
      store.dispatch('movies/createComment', {article_id, content: commentCommentContent.value})
      commentCommentContent.value = ''
      emit('updateReviewData')
    }

    const deleteCommentComment = (commentComment_id) => {
      store.dispatch('movies/deleteComment', commentComment_id)    
      emit('updateReviewData')
    }
    
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
      decodedToken,
      userData,
      colCnt,
      commentCommentToggled,
      commentCommentContent,
      toggleCommentComment,
      submitCommentComment,
      deleteCommentComment
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
  padding: 0.4rem 0rem 0 2rem;
  overflow-y: auto;
  overflow-wrap: break-word;
}

.user-rating-inner-container {
  padding-right: 2rem;
}

.comment-section {
  padding-top: 1rem;
  width: 50%;
  height: 22vh;
  color: white;
  /* overflow-y: auto;
  overflow-wrap: break-word; */
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

.comment-comment-input {
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 1.5rem;
  font-size: 1rem;
  width: 100%;
  background: gray;
  border: none;
  border-radius: 3px;
  color: white;
}
.comment-comment-input::placeholder {
  color: rgb(199, 199, 199);
}
.comment-comment-info {
  color: gray;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Transitions */
/* list transitions */
.list-enter-from {
  opacity: 0;
  transform: scale(0.6);
}
.list-enter-to {
  opacity: 1;
  transform: scale(1);
}
.list-enter-active {
  transition: all 0.5s ease;
}

.list-leave-from {
  opacity: 1;
  transform: scale(1);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list-leave-active {
  transition: all 0.5s ease;
  position: absolute;
}

.list-move {
  transition: all 0.3s ease;
}
</style>