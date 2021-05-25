<template>
<!-- Login, Logout modals -->


<!-- Movie Info -->
<div class="container-fluid movie-info-box d-flex flex-row p-0">
  <div class="movie-poster-div">
    <img class="movie-poster" :src="picked_movie.poster_path.replace('/original/', '/w500/')" alt="">
    <StarRatingSubmit @promptLogin="onPromptLogin"/>
  </div>
  <div class="movie-general-info-div">
    <div class="movie-general-info-inner-div">
      <h3>{{ picked_movie.title }}</h3>
      <p class="movie-year"><b>{{ picked_movie.release_date.substring(0, 4) }}</b></p>
      <span class="hashtags" v-for="(genre, idx) in picked_movie.genre_names" :key="idx" v-text="genre"></span>
      <!-- FIX NEEDED: cut sentence with a whole word -->
      <p class="movie-overview mt-4">{{ picked_movie.overview.substring(0, 600) }}</p>
      
      <hr>

      <!-- Cast / Crew -->
      <h5>Cast / Crew</h5>
      <p><span class="role-span">Director : </span>{{ picked_movie.director_name || "N/A" }}</p>
      <p><span class="role-span">Cast : </span>{{ (picked_movie.cast1_name ?  picked_movie.cast1_name : "N/A") + (picked_movie.cast2_name ? ", " : "") }}{{ (picked_movie.cast2_name ? picked_movie.cast2_name : "") + (picked_movie.cast3_name ? ", " : "") }}{{ picked_movie.cast3_name || "" }}</p> 
      <p><span class="role-span">Subscription : </span> Netflix</p> 
      
      <hr>

      <!-- Ratings -->
      <h5 class="mb-3">Ratings</h5>
      <MyRatingCharts />

      <hr>

      <!-- Reviews -->
      <h5>Reviews</h5>
      <ReviewCard v-for="(review, idx) in reviews" :key="idx" :review="review" />
    </div>
  </div>
</div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import StarRating from '@/components/StarRating.vue'
import StarRatingSubmit from '@/components/StarRatingSubmit.vue'

import ZingChart from '@/components/ZingChart.vue'
import MyRatingCharts from '@/components/MyRatingCharts.vue'

import ReviewCard from '@/components/ReviewCard.vue'

export default {
  name: 'Movies',
  components: {
    StarRating,
    StarRatingSubmit,
    ZingChart,
    MyRatingCharts,
    ReviewCard
  },
  setup() {
    // dummy reviews for tesing
    const reviews = ref(['this movie sucks', 'soso', 'best movie ever'])
    const store = useStore()
    const route = useRoute()

    // Login Modal
    const onPromptLogin = () => {
      console.log('not logged in')
    }

    // Get Movie Info
    const picked_movie = computed(() => store.state.movies.picked_movie)
    const changePicked_movie = () => {
      store.dispatch('movies/pickMovie', route.params.movie_id)
    }
    changePicked_movie()

    return {
      onPromptLogin,
      reviews,
      picked_movie,

    }
  }
}
</script>

<style scoped>
.movie-year {
  height: 2rem;
}
.movie-info-box {
  /* background: rgb(0, 0, 0, 0.7); */
  position: fixed;
  /* z-index: 50; */
  /* font-size: 50px; */
  font-family: Helvetica, Arial, "sans-serif";
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  text-align: center;
  color: white;
  text-decoration: none;
  /* line-height: 50px; */
  text-align: left;
  overflow-x: hidden;
}

.movie-poster-div {
  margin: 3vw 1vw 3vw 3vw;
  width: 20vw;
  border-radius: 5px;
}

.movie-poster {
  width: 100%;
  height: 30vw;
  max-height: 30vw;
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}


.movie-general-info-div {
  width: 75vw;
  margin: 0 0 3vw 1vw;
  overflow-y: auto;
}

.movie-general-info-inner-div {
  margin-top: 3vw;
  margin-right: 3vw;
}

.movie-ratings {
  width: 20vw;
  padding: 2vw;
  padding-right: 3vw;
}

.checked {
  color: orange;
}

.hashtags {
  background-color: rgb(93, 149, 168);
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  display: inline-block;
  margin-right: 0.6rem;
}

.role-span {
  color: rgb(160, 157, 157);
}

.review-span {
  color: cornflowerblue;
}
</style>