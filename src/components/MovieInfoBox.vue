<template>
  <div class="container movie-info-box px-5">
    <h1 class="mt-5">{{ picked_movie.title }}</h1>
    <p></p>
    <StarRating :rating="picked_movie.vote_average"/>
    <hr class="mt-4">
    <p class="movie-overview">{{ picked_movie.overview }}</p>
    <a href="#">Movie Details {{ picked_movie.id }}</a>
  	<!-- <iframe width="420" height="315" :src="picked_movie.trailer_path" frameborder="0"></iframe> -->
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import StarRating from '@/components/StarRating.vue'

export default {
  name: 'MovieInfoBox',
  components: {
    StarRating,
  },
  setup(props, { emit }) {
    // Vuex
    const store = useStore()
    const picked_movie = computed(() => store.state.movies.picked_movie)

    // Comm with three
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
  /* background: rgb(255, 255, 255, 0.7); */
  background: rgb(0, 0, 0, 0.7);
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
  color: white;
  text-decoration: none;
  line-height: 50px;
  border-radius: 10px;
  text-align: left;
  /* box-shadow: ; */
}

.movie-overview {
  text-align: left;
}

.checked {
  color: orange;
}

</style>