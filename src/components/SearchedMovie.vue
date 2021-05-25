<template>
  <div class="searched-movie-container d-flex">
    <div class="w-25">
      <img :src="movie.poster_path" class="searched-movie-img">
    </div>
    <div>
      <div>{{ movie.star_average }}</div>
      <h5>{{ movie.title }}</h5>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'SearchedMovie',
  props: ['movie'],
  setup(props) {
    const movie = computed(() => props.movie)

    return {
      movie
    }
  }
}
</script>

<style>
.searched-movie-container {
  color: white;
}
.searched-movie-img {
  width: 80%;
}
</style>