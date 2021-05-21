<template>
  <div class="movie-info-box">
    <button class="close" @click="onResetPickImage">X</button>
    <p>Movie id: {{ picked_movie_id }}</p>
    <p>Movie title</p>
    <p>Movie ratings</p>
    <a href="#">Movie Details</a>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'MovieInfoBox',
  props: {
    picked_movie_id: Number
  },
  setup(props, { emit }) {
    // Vuex
    const store = useStore()
    const moviesObj = computed(() => store.state.movies.moviesObj)
    const picked_movie_id = computed(() => store.state.movies.picked_movie_id)

    // Vue comm
    const onResetPickImage = () => {
      emit('onResetPickImage')
    }

    return {
      onResetPickImage,
      moviesObj, picked_movie_id
    }
  }
}
</script>

<style>
.movie-info-box {
  background: rgb(218, 218, 218);
  position: fixed;
  z-index: 50;
  left: 50%;
  top: 50%;
  transform: translate(-20%, -50%);
  font-size: 50px;
  font-family: Helvetica, Arial, "sans-serif";
  width: 50vw;
  height: 50vh;
  text-align: center;
  color: rgb(31, 31, 31);
  text-decoration: none;
  line-height: 50px;
  display: block;
}

.close {
  left: 43%;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>