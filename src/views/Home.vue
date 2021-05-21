<template>
  <!-- <canvas id="c"></canvas> -->
  <canvas id="c" :class="{ invisible: loadingThree, showAnimation: !loadingThree }"></canvas>
  <div class="wrap" v-if="loadingThree">
    <div class="bg">
      <div class="loading">
        <span class="title">loading...</span>
        <span class="text">최고의 영화 준비중...</span>
      </div>
    </div>
  </div>
  <div id="loading" v-if="loadingThree">
    <div class="progress"><div class="progressbar"></div></div>
  </div>
  <transition name="switch">
    <MovieInfoBox 
      v-if="isVisible"
      @onResetPickImage="onResetPickImage"
    />
  </transition>
  <ScrollNav @onClickNavMenu="handleClickNavMenu"/>
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
  setup() {
    ///////////////////////////////////
    // init
    const store = useStore()

    ///////////////////////////////////
    // Three 
    const isVisible = ref(false)
    const loadingThree = ref(true)
    const picked_movie_id = ref(0)
    const handleClickNavMenu = (genre) => {
      main.onScrollEvent(genre)
    }
    const onResetPickImage = () => {
      main.resetPickImage()
    }

    watch(isVisible, () => {
      store.dispatch('movies/pickMovie', picked_movie_id.value)
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
        main(moviesObj.value, isVisible, loadingThree, picked_movie_id)
      }, 1000)
      })

    return {
      isVisible, 
      loadingThree,
      picked_movie_id,
      handleClickNavMenu,
      onResetPickImage,
      moviesObj
    }
  },
}
</script>

<style scoped>
#c {
  position: fixed;
  display: block;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 0;
}

#c.invisible {
  visibility: hidden;
}

#c.showAnimation {
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

#loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
}
#loading .progress {
    margin: 1.5em;
    border: 1px solid white;
    width: 50vw;
}
#loading .progressbar {
    margin: 2px;
    background: white;
    height: 1em;
    transform-origin: top left;
    transform: scaleX(0);
}


/* Switch trasitions */
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
 @-webkit-keyframes bg {
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
}
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
		 right: 80px;
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
		 right: 80px;
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
		 right: 80px;
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
		 right: 80px;
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
	 background: rgb(73, 73, 73);
	 color: #eaf7ff;
	 position: absolute;
	 top: 46%;
	 left: 50%;
	 margin-left: -80px;
	 margin-top: -40px;
}
 .bg {
	 padding: 30px 30px 30px 0;
	 background: #306f99;
   animation: bg 3s linear infinite;
   box-shadow: inset 0 0 45px 30px black;
}
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
   animation: blink 4.4s infinite;
}
 .loading span.title {
   animation: title 4.4s linear infinite;
}
 .loading span.text {
   animation: title 4.4s linear 2.2s infinite;
	 opacity: 0;
}
</style>
