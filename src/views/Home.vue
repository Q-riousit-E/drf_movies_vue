<template>
  <canvas id="c"></canvas>
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
import { start, main } from '@/scripts/three.js'
import { onMounted, ref, watch } from 'vue'

export default {
  name: 'Home',
  components: {
    ScrollNav,
    MovieInfoBox
  },
  setup() {
    // Three methods
    const handleClickNavMenu = (genre) => {
      main.onScrollEvent(genre)
    }

    const onResetPickImage = () => {
      main.resetPickImage()
    }

    const isVisible = ref(false)

    watch(isVisible, () => {
      console.log(isVisible)
    })

    // connect with three js
    onMounted(() => {
      start(['yes'])
      main(isVisible)
    })

    return {
      handleClickNavMenu,
      onResetPickImage,
      isVisible
    }
  },
}
</script>

<style scoped>
#c {
  position: fixed;
  display: block;
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
  z-index: 2;
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