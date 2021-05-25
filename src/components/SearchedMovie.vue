<template>
<div @click="goToMovieDetail">
  <hr class="hr">
  <div class="searched-movie-container d-flex mt-3">
    <div class="w-25">
      <img :src="movie.poster_path.replace('/original/', '/w342/')" class="searched-movie-img">
    </div>
    <div class="searched-movie-info d-flex flex-column align-items-start w-75">
      <h5 class="fw-bold title">{{ movie.title }}</h5>
      <p class="fw-bold">{{ movie.release_date.substring(0, 4) }}</p>
      <div class="d-flex mt-2 mb-3" v-if="movie.genre_names.length">
        <span class="hashtags" v-for="(genre, idx) in movie.genre_names.slice(0, 4)" :key="idx" v-text="genre"></span>
      </div>
      <div v-else class="mb-2">N/A</div>
      <StarRatingSearchBar :rating="movie.star_average" />
    </div>
  </div>
</div>
</template>

<script>
import { computed, watch } from 'vue'
import StarRatingSearchBar from '@/components/StarRatingSearchBar.vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'SearchedMovie',
  components: {
    StarRatingSearchBar
  },
  props: ['movie'],
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const movie = computed(() => props.movie)

    // reload if different params
    watch(() => route.params, (to, from) => {
      console.log(to, from)
      if (to !== from) {
        location.reload()
      }
    })

    const goToMovieDetail = () => {
      console.log('clicked movie')
      console.log(route.params)
      router.push({ name: 'MovieDetail', params: {movie_id: movie.value.id} })
    }

    return {
      movie,
      goToMovieDetail
    }
  }
}
</script>

<style scoped>
.searched-movie-container {
  color: white;
}
.searched-movie-img {
  width: 80%;
}

.searched-movie-info {
  text-align: left;
  padding-right: 1rem;
}

.hashtags {
  background-color: rgb(93, 149, 168);
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  display: inline-block;
  margin-right: 0.6rem;
  font-size: 0.7rem;
}

.hr {
  background-color: #fff;
}
</style>