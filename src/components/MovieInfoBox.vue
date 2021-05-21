<template>
  <div class="movie-info-box">
    <div id="closeGifContainer">
      <img id="closeGif" src="delete.gif" class="freezeframe" @click="onResetPickImage">
    </div>
    <p>Movie id: {{ picked_movie.id }}</p>
    <p>Movie title: {{ picked_movie.title }}</p>
    <p>Movie ratings: {{ picked_movie.vote_average }}</p>
    <a href="#">Movie Details {{ picked_movie.id }}</a>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import Freezeframe from 'freezeframe'

export default {
  name: 'MovieInfoBox',
  setup(props, { emit }) {
    // Vuex
    const store = useStore()
    const moviesObj = computed(() => store.state.movies.moviesObj)
    const picked_movie = computed(() => store.state.movies.picked_movie)

    // Vue comm
    const onResetPickImage = () => {
      emit('onResetPickImage')
    }

    // close button animation
    onMounted(() => {
      const closeGif = new Freezeframe('#closeGif', {
        trigger: 'hover'
      })
    })

    return {
      onResetPickImage,
      moviesObj, picked_movie
    }
  },
}
</script>

<style>
.movie-info-box {
  background: rgb(255, 255, 255);
  position: fixed;
  z-index: 50;
  left: 50%;
  top: 50%;
  transform: translate(-20%, -50%);
  /* font-size: 50px; */
  font-family: Helvetica, Arial, "sans-serif";
  width: 50vw;
  /* height: 60vh; */
  text-align: center;
  color: rgb(31, 31, 31);
  text-decoration: none;
  line-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ff-canvas,
.ff-image {
  height: 100%;
}

#closeGifContainer {
  width: 3vw;
  height: 3vh;
  cursor: pointer;
  align-self: flex-end;
}
</style>