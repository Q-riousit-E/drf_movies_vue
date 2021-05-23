<template>
  <div class="movie-info-box">
    <h1>Movie title: {{ picked_movie.title }}</h1>
    <p>Movie ratings: {{ picked_movie.vote_average }}</p>
    <a href="#">Movie Details {{ picked_movie.id }}</a>
    <!-- <p>trailer path: {{ picked_movie.trailer_path }}</p> -->
  	<iframe v-if="true" width="420" height="315" :src="picked_movie.trailer_path" frameborder="0"></iframe>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

// import { RadarChart } from '../scripts/radarChart.js'

export default {
  name: 'MovieInfoBox',
  setup(props, { emit }) {
    // Vuex
    const store = useStore()
    const picked_movie = computed(() => store.state.movies.picked_movie)

    // Vue comm
    const onResetPickImage = () => {
      emit('onResetPickImage')
    }

    return {
      onResetPickImage,
      picked_movie
    }
  },
}
</script>

<style>
.movie-info-box {
  background: rgb(255, 255, 255, 0.4);
  position: fixed;
  z-index: 50;
  left: 50%;
  top: 50%;
  transform: translate(-20%, -50%);
  /* font-size: 50px; */
  font-family: Helvetica, Arial, "sans-serif";
  width: 50vw;
  height: 60vh;
  text-align: center;
  color: rgb(31, 31, 31);
  text-decoration: none;
  line-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 10px;
  /* box-shadow: ; */
}

</style>