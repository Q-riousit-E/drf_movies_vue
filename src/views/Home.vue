<template>
  <canvas id="c" :class="{ invisible: loadingThree }"></canvas>
  <div id="loading" v-if="loadingThree">
    <div class="progress"><div class="progressbar"></div></div>
  </div>
  <transition name="switch">
    <MovieInfoBox 
      v-if="isVisible"
      @onResetPickImage="onResetPickImage"
      :picked_movie_id="picked_movie_id"
    />
  </transition>
  <ScrollNav @onClickNavMenu="handleClickNavMenu"/>
</template>

<script>
import ScrollNav from '@/components/ScrollNav.vue'
import MovieInfoBox from '@/components/MovieInfoBox.vue'
import { start, main } from '@/scripts/three.js'

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

    /////////////////////////////////////
    // When Mounted
    onMounted(() => {
      start(['yes'])
      main(moviesObj.value, isVisible, loadingThree, picked_movie_id)
    })

    return {
      isVisible, 
      loadingThree,
      picked_movie_id,
      handleClickNavMenu,
      onResetPickImage,
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
  z-index: 2;
}

#c.invisible {
  visibility: hidden;
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
</style>