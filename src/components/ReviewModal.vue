<template>
<fieldset class="checkbox-group" @click="closeReviewModal">
	<!-- <legend class="checkbox-group-legend">Choose your favorites</legend> -->

  <div class="rating-group">

    <!-- Star Rating info -->
    <div 
      class="user-info" 
      :class="{ reviewSelected: !hexaSelected && reviewSelected, hexaSelected: !reviewSelected && hexaSelected, bothSelected: reviewSelected && hexaSelected }"
    >
      <h1><b>{{ decodedToken.username }}</b></h1>
      <h3>★ x {{ simpleRating }}</h3>
    </div>
    <button v-if="!reviewSelected && !hexaSelected" class="btn btn-primary star-rating-btn">Submit Star Rating</button>

    <div class="input-data-group">
      <!-- Review -->
      <div id="reviewGroup" class="checkbox">
        <label class="checkbox-wrapper">
          <input type="checkbox" class="checkbox-input" v-model="reviewSelected" />
          <!-- <span id="review-span" class="checkbox-tile" @click="toggleReviewSelected"> -->
          <span id="review-span" class="checkbox-tile">
            <!-- btns -->
            <div id="review-btn-container" class="checkbox-label w-100 h-100" v-if="!reviewSelected" @click="submitReview">
              <i class="icon fas fa-plus"></i>
            </div>

            <!-- input -->
            <div class="w-100 h-100" v-if="reviewSelected">
              <textarea id="review-input" class="px-5"></textarea>
              <button class="btn btn-primary star-review-btn" v-if="reviewSelected && !hexaSelected">Submit Star + Review</button>
            </div>

          </span>
        </label>
      </div>

      <!-- Hexa Rating -->
      <div id="hexaGroup" class="checkbox">
        <label class="checkbox-wrapper">
          <input type="checkbox" class="checkbox-input" v-model="hexaSelected" />
          <!-- <span id="hexa-span" class="checkbox-tile" @click="toggleHexaSelected"> -->
          <span id="hexa-span" class="checkbox-tile">
            <!-- btns -->
            <div id="hexa-btn-container" class="checkbox-label" v-if="!hexaSelected">
              <i class="icon fas fa-plus"></i>
              <!-- <span class="checkbox-label"><i class="icon fas fa-edit"></i></span> -->
              <!-- <span class="checkbox-label"><i class="icon far fa-edit"></i></span> -->
            </div>

            <!-- inputs -->
            <div class="w-100 h-100" v-if="hexaSelected">
              <input id="review-input" />
              <button class="btn btn-primary star-hexa-btn" v-if="!reviewSelected && hexaSelected">Submit Star + Review</button>
            </div>

          </span>
        </label>
      </div>
    </div>
    <button class="btn btn-primary star-review-hexa-btn" v-if="reviewSelected && hexaSelected">Submit Star + Review + Hexa</button>
  </div>
</fieldset> 
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ReviewModal',
  emits: ['closeReviewModal'],
  setup(props, { emit }) {
    // init
    const store = useStore()

    // get data from store 
    const decodedToken = computed(() => store.state.auth.decodedToken)
    const simpleRating = computed(() => store.state.movies.simpleRating)
    const reviewData = ref(null)
    const hexaData = ref({plot: 3, cinematograpy: 4, originality: 5})  // dummy for testing

    // variables for user-info classes
    const reviewSelected = ref(false)
    const hexaSelected = ref(false)

    // const toggleReviewSelected = (e) => {
    //   console.log(e.target)
    //   const reviewBtnContainer = document.querySelector('#review-btn-container')
    //   const reviewSpan = document.querySelector('#review-span')
    //   if (e.target === reviewBtnContainer || e.target === reviewSpan) {
    //     // reviewSelected.value = !reviewSelected.value
    //   }
    //   console.log(reviewSelected.value, hexaSelected.value)
    // }
    // const toggleHexaSelected = (e) => {
    //   console.log(e.target)
    //   const hexaBtnContainer = document.querySelector('#hexa-btn-container')
    //   const hexaSpan = document.querySelector('#hexa-span')
    //   if (e.target === hexaBtnContainer || e.target === hexaSpan) {
    //     // hexaSelected.value = !hexaSelected.value
    //   }
    //   console.log(reviewSelected.value, hexaSelected.value)
    // }

    // Close Add modal on click background
    const closeReviewModal = (e) => {
      const reviewModalBackground = document.querySelector('.checkbox-group')
      if (e.target === reviewModalBackground) {
        emit('closeReviewModal')
      }
    }
    
    return {
      decodedToken, simpleRating, reviewData, hexaData,
      reviewSelected, hexaSelected,
      //  toggleReviewSelected, toggleHexaSelected,
      closeReviewModal
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  width: 70vw;
  height: 70vh;
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
		border-color: white;
		// color: #2260ff;
		&:before {
			transform: scale(1);
			opacity: 1;
			background-color: #2260ff;
			border-color: #2260ff;
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
	border: 2px solid #b5bfd9;
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

.user-info {
  display: flex;
  color: black;
  width: 50%;
  height: 15%;
  text-align: center;
  background: white;
  margin: 0;
  align-self: center;
  justify-content: space-between;
  align-items: center;
  padding: 0 3rem 0 3rem;
  border: 1px solid black;
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
  height: 90%;
  border: none;
  font-size: 2rem;
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
</style>