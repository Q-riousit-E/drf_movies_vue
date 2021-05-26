<template>
<div>
	<!-- Three.js canvas -->
  <canvas id="c" :class="{ invisible: loadingThree, showAnimation: !loadingThree }"></canvas>

	<!-- Loading comments -->
  <div class="wrap" v-if="loadingThree">
    <div class="bg">
      <div class="loading">
        <span class="title">loading...{{Math.floor(progressCount)}}%</span>
        <span class="text">loading...{{Math.floor(progressCount)}}%</span>
      </div>
    </div>
  </div>

	<!-- Progress Bar -->
	<transition name="fade" mode="out-in">
		<div class="progress-bar" v-if="loadingThree"></div>
	</transition>

	<!-- Movie Info Box -->
  <!-- <transition name="switch"> -->
	<MovieInfoBox 
		v-if="isVisible"
	/>
  <!-- </transition> -->

	<transition name="fade" mode="out-in">
		<ScrollNav @onClickNavMenu="handleClickNavMenu" :currMovieGenre="currMovieGenre" v-show="!isVisible && !loadingThree" />
	</transition>

	<!-- Scroll Icon -->
	<section v-if="!isVisible" :class="{ invisible: loadingThree, showAnimation: !loadingThree }" class="example example--1">
    <span class="scroll-icon">
      <span class="scroll-icon__wheel-outer">
        <span class="scroll-icon__wheel-inner"></span>
      </span>
    </span>
    <h2 class="scroll-text">Scroll</h2>
  </section>
</div>
</template>

<script>
import ScrollNav from '@/components/ScrollNav.vue'
import MovieInfoBox from '@/components/MovieInfoBox.vue'
import { main } from '@/scripts/three.js'

import { onMounted, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Home',
  components: {
    ScrollNav,
    MovieInfoBox
  },
	// emits: ['showMainNav', 'hideMainNav'],
  setup(props, { emit }) {
    ///////////////////////////////////
    // init
		// emit('hideMainNav')
    const store = useStore()

		///////////////////////////////////
		// Progress Bar
		const progressCount = ref(0)

		watch(progressCount, () => {
			const bar = document.querySelector('.progress-bar')
			bar.style.width = progressCount.value + '%'
			if (progressCount.value === 100) {
				// emit('showMainNav')
			}
		})

    ///////////////////////////////////
    // Three 
    const isVisible = ref(false)
    const loadingThree = ref(true)
    const picked_movie_id = ref(0)
		const currMovieGenre = ref('sci_fi')
    const handleClickNavMenu = (genre) => {
      main.onScrollEvent(genre)
    }

		// three -> change data in store 
    watch(isVisible, () => {
      store.dispatch('movies/pickMovie', picked_movie_id.value)
    })

		watch(currMovieGenre, () => {
			store.dispatch('movies/changeCurrMovieGenre', currMovieGenre.value)
		})

    ////////////////////////////////////
    // DRF
    const getMovies = () => {
      store.dispatch('movies/getMovies')
    }
    getMovies()
    const moviesObj = computed(() => store.state.movies.moviesObj)

    ///////////////////////////////////
    // When Mounted
    onMounted(() => {
      // logic update needed -> to fully asynchrounous 
      setTimeout(() => {
        main(progressCount, moviesObj.value, isVisible, loadingThree, picked_movie_id, currMovieGenre)
      }, 1000)
      })

    return {
			progressCount,
      isVisible, 
      loadingThree,
      picked_movie_id,
			currMovieGenre,
      handleClickNavMenu,
      moviesObj
    }
  },
}
</script>

<style scoped>
/* Three js */
#c {
  position: fixed;
  display: block;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1;
}

.invisible {
  visibility: hidden;
}

.showAnimation {
  animation: fadeIn 3s ease-in
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dg {
	position: relative;
	z-index: 4;
	display: none;
}

/* Progress Bar */
.progress-bar {
	position: absolute;
	top: 50%;
	height: 2px;
	background: rgb(255, 255, 255);
}

/* Trasitions */
.switch-enter-from,
.switch-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%);
}

.switch-enter-active {
  transition: all 1.1s ease;
}

.switch-leave-active {
  transition: all 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.6s ease;
}

/* Loading Text */
@-webkit-keyframes title {
	 0% {
		 opacity: 0;
		 right: 130px;
	}
	 48% {
		 opacity: 0;
		 right: 130px;
	}
	 52% {
		 opacity: 1;
		 right: 30px;
	}
	 70% {
		 opacity: 1;
		 right: 30px;
	}
	 100% {
		 opacity: 0;
		 right: 30px;
	}
}
 @-moz-keyframes title {
	 0% {
		 opacity: 0;
		 right: 130px;
	}
	 48% {
		 opacity: 0;
		 right: 130px;
	}
	 52% {
		 opacity: 1;
		 right: 30px;
	}
	 70% {
		 opacity: 1;
		 right: 30px;
	}
	 100% {
		 opacity: 0;
		 right: 30px;
	}
}
 @-webkit-keyframes fade {
	 0% {
		 opacity: 1;
	}
	 100% {
		 opacity: 0;
	}
}
 @-moz-keyframes fade {
	 0% {
		 opacity: 1;
	}
	 100% {
		 opacity: 0;
	}
}
 /* @-webkit-keyframes bg {
   0% {
		 background-color: black;
   }
	 25% {
		 background-color: #306f99;
	}
	 50% {
		 background-color: #19470f;
	}
	 75% {
		 background-color: #734a10;
	}
}
 @-moz-keyframes bg {
   0% {
		 background-color: black;
   }
	 25% {
		 background-color: #306f99;
	}
	 50% {
		 background-color: #19470f;
	}
	 75% {
		 background-color: #734a10;
	}
} */
 @-webkit-keyframes blink {
	 0% {
		 opacity: 0;
	}
	 5% {
		 opacity: 1;
	}
	 10% {
		 opacity: 0;
	}
	 15% {
		 opacity: 1;
	}
	 20% {
		 opacity: 0;
	}
	 25% {
		 opacity: 1;
	}
	 30% {
		 opacity: 0;
	}
	 35% {
		 opacity: 1;
	}
	 40% {
		 opacity: 0;
		 right: -21px;
	}
	 45% {
		 opacity: 1;
		 right: 100px;
	}
	 50% {
		 opacity: 0;
		 right: -21px;
	}
	 51% {
		 right: -21px;
	}
	 55% {
		 opacity: 1;
	}
	 60% {
		 opacity: 0;
	}
	 65% {
		 opacity: 1;
	}
	 70% {
		 opacity: 0;
	}
	 75% {
		 opacity: 1;
	}
	 80% {
		 opacity: 0;
	}
	 85% {
		 opacity: 1;
	}
	 90% {
		 opacity: 0;
		 right: -21px;
	}
	 95% {
		 opacity: 1;
		 right: 100px;
	}
	 96% {
		 right: -21px;
	}
	 100% {
		 opacity: 0;
		 right: -21px;
	}
}
 @-moz-keyframes blink {
	 0% {
		 opacity: 0;
	}
	 5% {
		 opacity: 1;
	}
	 10% {
		 opacity: 0;
	}
	 15% {
		 opacity: 1;
	}
	 20% {
		 opacity: 0;
	}
	 25% {
		 opacity: 1;
	}
	 30% {
		 opacity: 0;
	}
	 35% {
		 opacity: 1;
	}
	 40% {
		 opacity: 0;
		 right: -21px;
	}
	 45% {
		 opacity: 1;
		 right: 100px;
	}
	 50% {
		 opacity: 0;
		 right: -21px;
	}
	 51% {
		 right: -21px;
	}
	 55% {
		 opacity: 1;
	}
	 60% {
		 opacity: 0;
	}
	 65% {
		 opacity: 1;
	}
	 70% {
		 opacity: 0;
	}
	 75% {
		 opacity: 1;
	}
	 80% {
		 opacity: 0;
	}
	 85% {
		 opacity: 1;
	}
	 90% {
		 opacity: 0;
		 right: -21px;
	}
	 95% {
		 opacity: 1;
		 right: 100px;
	}
	 96% {
		 right: -21px;
	}
	 100% {
		 opacity: 0;
		 right: -21px;
	}
}
 .wrap {
	 font-family: Purista, sans-serif, arial;
	 /* background: rgb(73, 73, 73); */
	 color: #eaf7ff;
	 position: absolute;
	 top: 50%;
	 left: 51%;
	 margin-left: -100px;
	 margin-top: -40px;
}
 /* .bg {
	 padding: 30px 30px 30px 0;
	 background: #306f99;
   animation: bg 3s linear infinite;
   box-shadow: inset 0 0 45px 30px rgb(30 40 42);
} */
.loading {
	 position: relative;
	 text-align: right;
	 height: 20px;
	 width: 150px;
   text-shadow: 0 0 6px #bce4ff;
}
 .loading span {
	 display: block;
	 text-transform: uppercase;
	 position: absolute;
	 right: 30px;
	 height: 20px;
	 width: 200px;
	 line-height: 20px;
}
 .loading span:after {
	 content: "";
	 display: block;
	 position: absolute;
	 top: -2px;
	 right: -21px;
	 height: 20px;
	 width: 16px;
   background: #eaf7ff;
   box-shadow: 0 0 15px #bce4ff;
   animation: blink 3.0s infinite;
}
 .loading span.title {
   animation: title 3.0s linear infinite;
}
 .loading span.text {
   animation: title 3.0s linear 1.5s infinite;
	 opacity: 0;
}

/* Scroll-icon  */
.example {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
	z-index: 10;
	position: absolute;
	top: 94%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.scroll-icon {
  display: block;
  position: relative;
  height: 4.2vh;
  width: 2.1vh;
  border: 0.35vh solid #fff;
  border-radius: 1.4vh;
}

.scroll-icon__wheel-outer {
  display: block;
  position: absolute;
  left: 50%;
  top: 0.84vh;
  height: 1.4vh;
  width: 0.6vh;
  margin-left: -0.3vh;
  border-radius: 0.56vh;
  overflow: hidden;
}

.scroll-icon__wheel-inner {
  display: block;
  height: 100%;
  width: 100%;
  border-radius: inherit;
  background: #fff;
  animation: scroll_1 2.75s ease-in-out infinite;
}

.scroll-text {
	margin: 1vh;
  color: white;
  font-family: Roboto, sans-serif;
  font-size: 1.5rem;
	z-index: 10;
}

@keyframes scroll_1 {
  0%   { transform: translateY(0); }
  25%  { transform: translateY(-0.6vh); }
  50%  { transform: translateY(0); }
  75%  { transform: translateY(0.6vh); }
  100% { transform: translateY(0); }
}
</style>
