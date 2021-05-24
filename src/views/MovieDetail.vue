<template>
<div class="container-fluid movie-info-box d-flex flex-row p-0">
  <div class="movie-poster-div">
    <img class="movie-poster" :src="picked_movie.poster_path" alt="">
    <StarRatingSubmit />
  </div>
  <div class="movie-general-info-div">
    <h3>{{ picked_movie.title }}</h3>
    <p class="movie-year"><b>{{ picked_movie.release_date.substring(0, 4) }}</b></p>
    <!-- FIX NEEDED: get hashtag data from db -->
    <span class="hashtags">sci-fi</span>
    <span class="hashtags">action</span>
    <!-- FIX NEEDED: cut sentence witha whole word -->
    <p class="movie-overview mt-4">{{ picked_movie.overview.substring(0, 600) }}</p>
    
    <hr>

    <!-- Cast / Crew -->
    <h5>Cast / Crew</h5>
    <p><span class="role-span">Director : </span> Christopher Nolan</p>
    <p><span class="role-span">Cast : </span> Tom Cruise, Lebron James, Harry Potter</p> 
    <p><span class="role-span">Subscription : </span> Netflix</p> 
    
    <hr>

    <!-- Ratings -->
    <h5 class="mb-3">Ratings</h5>
    <MyRatingCharts />
  </div>
</div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import StarRating from '@/components/StarRating.vue'
import StarRatingSubmit from '@/components/StarRatingSubmit.vue'

import ZingChart from '@/components/ZingChart.vue'
import MyRatingCharts from '@/components/MyRatingCharts.vue'

export default {
  name: 'Movies',
  components: {
    StarRating,
    StarRatingSubmit,
    ZingChart,
    MyRatingCharts
  },
  setup() {
    const store = useStore()
    const picked_movie = computed(() => store.state.movies.picked_movie)

    return {
      picked_movie
    }
  }
}
</script>

<style scoped>
.movie-year {
  height: 2rem;
}
.movie-info-box {
  /* background: rgb(255, 255, 255, 0.7); */
  background: rgb(0, 0, 0, 0.7);
  position: fixed;
  z-index: 50;
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
  overflow-y: auto;
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
}


.movie-general-info-div {
  width: 75vw;
  margin: 3vw 3vw 3vw 1vw;
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