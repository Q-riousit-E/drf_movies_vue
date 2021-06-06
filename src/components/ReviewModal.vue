<template>
<fieldset class="checkbox-group" @click="handleCloseReviewModal">
	<!-- <legend class="checkbox-group-legend">Choose your favorites</legend> -->

  <div class="rating-group">

    <!-- Star Rating info -->
    <div 
      class="user-info" 
      :class="{ 
        reviewSelected: (!hexaSelected && reviewSelected) || (!hexaDataFromStore && commentDataFromStore), 
        hexaSelected: (!reviewSelected && hexaSelected) || (hexaDataFromStore?.originality && !commentDataFromStore), 
        bothSelected: (reviewSelected && hexaSelected) || (hexaDataFromStore?.originality && commentDataFromStore)
      }"
    >
      <h1><b>{{ decodedToken.username }}</b></h1>
      <h3><span style="color: orange;">★</span> <b>x {{ simpleRating }}</b></h3>
    </div>

    <div class="input-data-group">

      <!-- Review -->
      <div id="reviewGroup" class="checkbox">
        <label class="checkbox-wrapper">
          <input id="review-checkbox" type="checkbox" class="checkbox-input" v-model="reviewSelected" />
          <span id="review-span" class="checkbox-tile">
            <!-- btns -->
            <div id="review-btn-container" class="checkbox-label w-100 h-100" v-if="!reviewSelected">
              <i class="icon fas fa-plus" v-if="!commentDataFromStore"></i>
              <div class="w-100 h-100" v-else>
                <!-- formerly Written review -->
                <div class="former-val-div" v-text="commentDataFromStore.content"></div>
                <div class="icons-holder w-100 h-100">
                  <i class="icon edit-icons fas fa-edit"></i>
                  <i class="icon edit-icons fas fa-eraser" @click="handleDeleteComment"></i>
                </div>
              </div>
            </div>

            <!-- input -->
            <div class="w-100 h-100" v-if="reviewSelected">
              <textarea key="1" id="review-input" class="px-4" v-model="commentData"></textarea>
              <button class="btn btn-secondary star-review-btn" v-if="reviewSelected && !hexaSelected" @click="submitComment">Submit Comment</button>
            </div>
            <!-- <p style="color: white;">reviewSelected: {{ reviewSelected }}</p>
            <p style="color: white;">commentData: {{ commentData }}</p>
            <p style="color: white;">commentDataFromStore: {{ commentDataFromStore }}</p> -->
          </span>
        </label>
      </div>

      <!-- Hexa Rating -->
      <div id="hexaGroup" class="checkbox">
        <label class="checkbox-wrapper">
          <input type="checkbox" class="checkbox-input" v-model="hexaSelected" />
          <span id="hexa-span" class="checkbox-tile" @click="cancelHexaSpanClick">
            <!-- btns -->
            <div id="hexa-btn-container" class="checkbox-label w-100 h-100" v-if="!hexaSelected">
              <i class="icon fas fa-plus" v-if="!hexaDataFromStore.originality"></i>
              <div class="w-100 h-100" v-else>
                <!-- formerly Written review -->
                <HexaStarRating />
                <div class="icons-holder w-100 h-100">
                  <i class="icon edit-icons fas fa-edit"></i>
                  <i class="icon edit-icons fas fa-eraser" @click="handleDeleteHexa"></i>
                </div>
              </div>
            </div>

            <!-- inputs -->
            <div class="w-100 h-100" v-if="hexaSelected">
              <HexaStarRating @setHexaData="handleGetHexaFromForm" />
              <button class="btn btn-secondary star-review-btn" v-if="hexaSelected && !reviewSelected" @click="handleSubmitHexa">Submit Hexa</button>
            </div>
            <!-- <p style="color: white;">hexaSelected: {{ hexaSelected }}</p>
            <p style="color: white;">hexaData: {{ hexaData }}</p>
            <p style="color: white;">hexaDataFromStore: {{ hexaDataFromStore }}</p> -->

          </span>
        </label>
      </div>
    </div>
    <button class="btn btn-secondary star-review-hexa-btn" v-if="reviewSelected && hexaSelected" @click="submitCommentHexa">Submit Comment + Hexa</button>
  </div>
</fieldset> 
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import HexaStarRating from '@/components/HexaStarRating.vue'

export default {
  name: 'ReviewModal',
  components: {
    HexaStarRating
  },
  emits: ['closeReviewModal', 'updateReviewData'],
  setup(props, { emit }) {
    // init
    const store = useStore()
    const route = useRoute()

    // get data from store 
    const decodedToken = computed(() => store.state.auth.decodedToken)
    const simpleRating = computed(() => store.state.movies.simpleRating)
    const commentData = ref('')
    const commentDataFromStore = computed(() => store.state.movies.myComment)
    const hexaData = ref({
      originality: 0,
      plot: 0,
      cinematography: 0,
      music_score: 0,
      characters: 0,
      entertainment_value: 0,
    })
    const hexaDataFromStore = computed(() => store.state.movies.myHexa)

    // variables for user-info classes
    const reviewSelected = ref(false)
    const hexaSelected = ref(false)

    // Close Add modal on click background
    const closeReviewModal = () => {
      emit('closeReviewModal')
    }
    const handleCloseReviewModal = (e) => {
      const reviewModalBackground = document.querySelector('.checkbox-group')
      if (e.target === reviewModalBackground) {
        closeReviewModal()
      }
    }

    //// Submit reviews
    // 1. star + comment
    const submitComment = () => {
      // const reviewSpan = document.querySelector('#review-span')
      console.log('submit comment:', commentData.value)
      store.dispatch('movies/updateComment', {movie_id: route.params.movie_id, comment: commentData.value})
      // console.log(reviewSpan)
      emit('updateReviewData')
      closeReviewModal()
    }
    const handleDeleteComment = (e) => {
      e.preventDefault()
      console.log(e.target)
      store.dispatch('movies/deleteComment', route.params.movie_id)
      closeReviewModal()
    }

    // 2. star + hexa
    const handleGetHexaFromForm = (data) => {
      hexaData.value[data.rater] = data.value
    }
    const handleSubmitHexa = () => {
      console.log('submit star + hexa', hexaData.value)
      store.dispatch('movies/updateHexa', {movie_id: route.params.movie_id, hexaData: hexaData.value})
      emit('updateReviewData')
      closeReviewModal()
    }
    const handleDeleteHexa = () => {
      store.dispatch('movies/deleteHexa', route.params.movie_id)
      closeReviewModal()
    }
    const cancelHexaSpanClick = (e) => {
      const hexaSpan = document.querySelector('#hexa-span')

      // if hexaspan is clicked while hexa is selected -> unselect hexa
      if (e.target === hexaSpan) {
        console.log(e.target)
      } else if (hexaSelected.value) {
        e.preventDefault()
      }
    }


    // 3. star + comment + hexa
    const submitCommentHexa = () => {
      console.log('submit star + comment + hexa')
      store.dispatch('movies/updateComment', {movie_id: route.params.movie_id, comment: commentData.value})
      store.dispatch('movies/updateHexa', {movie_id: route.params.movie_id, hexaData: hexaData.value})
      emit('updateReviewData')
      closeReviewModal()
    }

    // onMounted
    onMounted(() => {
      // initialize data values
      if (commentDataFromStore.value) {
        commentData.value = commentDataFromStore.value.content
      } else {
        commentData.value = ''
      }
      if (hexaDataFromStore.value) {
        hexaData.value = {...hexaDataFromStore.value}
      } else {
        hexaData.value = null
      }
    })
    
    return {
      decodedToken, simpleRating, 
      commentData, hexaData,
      commentDataFromStore, hexaDataFromStore,
      reviewSelected, hexaSelected,
      handleCloseReviewModal,
      submitComment, 
      handleGetHexaFromForm, cancelHexaSpanClick, handleSubmitHexa, handleDeleteHexa,
      submitCommentHexa,
      handleDeleteComment,
    }
  }
}
</script>

<style lang='scss' scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");

*,
*:after,
*:before {
	box-sizing: border-box;
}

.checkbox-group {
  background: rgba(0, 0, 0, 0.8);
  z-index: 300;
  position: absolute;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 100vw;
  height: 100vh;
	margin-left: auto;
	margin-right: auto;
}

.checkbox-group-legend {
	font-size: 1.5rem;
	font-weight: 700;
	color: #9c9c9c;
	text-align: left;
	line-height: 1.125;
	margin-bottom: 1.25rem;
}

.rating-group {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  width: 70vw;
  height: 65vh;
  color: black;
}

.input-data-group {
  display: flex;
  width: 100%;
  height: 80%;
}

.checkbox {
  width: 50%;
  height: 100%;
}

.checkbox-wrapper {
  width: 100%;
  height: 100%;
}

.checkbox-input {
	// Code to hide the input
	// clip: rect(0 0 0 0);
	// clip-path: inset(100%);
	height: 1px;
	width: 1px;
	overflow: hidden;
	position: absolute;
	white-space: nowrap;

	&:checked + .checkbox-tile {
		border-color: black;
		// color: #2260ff;
		&:before {
			transform: scale(1);
			opacity: 1;
			background-color: #2260ff;
			// border-color: #2260ff;
		}
		
		.checkbox-icon, .checkbox-label {
			color: #2260ff;
		}
	}
}

.checkbox-tile {
	// display: flex;
	// flex-direction: column;
  // justify-content: center;
	// align-items: center;
  display: block;
	width: 100%;
  height: 100%;
	// border: 2px solid #b5bfd9;
	background-color: #fff;
	box-shadow: 0 5px 10px rgba(#000, 0.1);
	transition: 0.15s ease;
	cursor: pointer;
	position: relative;

	&:before {
		content: "";
		position: absolute;
		display: block;
		width: 2rem;
		height: 2rem;
		border: 2px solid #b5bfd9;
		background-color: #fff;
		border-radius: 50%;
		// top: 0.25rem;
		// left: 0.25rem;
		top: -1rem;
		left: -1rem;
    // transform: translateX(-50%);
		opacity: 0;
		transform: scale(0);
		transition: 0.25s ease;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' fill='%23FFFFFF' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='none'%3E%3C/rect%3E%3Cpolyline points='216 72.005 104 184 48 128.005' fill='none' stroke='%23FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'%3E%3C/polyline%3E%3C/svg%3E");
		background-size: 24px;
		background-repeat: no-repeat;
		background-position: 50% 50%;
	}

	&:hover {
		border-color: #2260ff;
		&:before {
			transform: scale(1);
			opacity: 1;
		}
	}
}

.checkbox-icon {
	transition: .375s ease;
	color: #494949;
	svg {
		width: 5rem;
		height: 5rem;
	}
}

.checkbox-label {
	color: #707070;
	transition: .375s ease;
	text-align: center;
  width: 100%;
  height: 100%;
}

.icon {
  position: relative;
  font-size: 5rem;
  top: 50%;
  transform: translateY(-50%);
}

.icon:hover {
  color: #2260ff;
}

.icons-holder {
  position: absolute;
  top: -50%;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

.user-info {
  display: flex;
  color: white;
  width: 50%;
  height: 15%;
  text-align: center;
  background: rgb(68 68 68);
  margin: 0;
  align-self: center;
  justify-content: space-between;
  align-items: center;
  padding: 0 3rem 0 3rem;
  border-bottom: 1px solid white;
}

.reviewSelected {
  width: 50%;
  align-self: flex-start;
  margin-bottom: 0;
}

.hexaSelected {
  width: 50%;
  align-self: flex-end;
  margin-bottom: 0;
}

.bothSelected {
  width: 100%;
  margin-bottom: 0;
}

.star-rating-btn {
  align-self: center;
  width: 50%;
  margin-bottom: 10vh;
}

#review-input {
  width: 100%;
  height: 100%;
  border: none;
  font-size: 2rem;
  background: #444444;
  color: #939393;
}

.star-review-btn {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}

.star-hexa-btn {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}

.star-review-hexa-btn {
  width: 100%;
  margin-top: auto;
}

.edit-center {
  position: absolute;
  
}

.former-val-div {
  width: 100%;
  height: 100%;
  padding: 2rem 2rem 2rem 2rem;
  font-size: 2rem;
  text-align: left;
  color: #939393;
  overflow-wrap: break-word;
  overflow-y: auto;
}
.former-val-div:hover {
  border: 1px solid rgb(171, 171, 243);
}

.icon {
  color: white;
}

.edit-icons {
  font-size: 3rem;
}

#review-span,
#hexa-span {
  background: rgb(68 68 68);
}

</style>