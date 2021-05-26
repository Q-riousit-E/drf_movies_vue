<template>
<div class="container-fluid movie-info-box d-flex flex-row p-0">
  <div class="movie-general-info-div">
    <h3>{{ picked_movie.title }}</h3>
    <p class="movie-year"><b>{{ picked_movie.release_date.substring(0, 4) }}</b></p>
    <span class="hashtags" v-for="(genre, idx) in picked_movie.genre_names" :key="idx" v-text="genre"></span>
    <!-- FIX NEEDED: cut sentence witha whole word -->
    <p class="movie-overview mt-4">{{ picked_movie.overview.substring(0, 200) + '...' }}</p>
    <hr>
    <p><span class="role-span">Director : </span>{{ picked_movie.director_name || "N/A" }}</p>
    <p><span class="role-span">Cast : </span>{{ (picked_movie.cast1_name ?  picked_movie.cast1_name : "N/A") + (picked_movie.cast2_name ? ", " : "") }}{{ (picked_movie.cast2_name ? picked_movie.cast2_name : "") + (picked_movie.cast3_name ? ", " : "") }}{{ picked_movie.cast3_name || "" }}</p> 
    <hr>
    <router-link :to="{ name: 'MovieDetail', params: { movie_id: picked_movie.id }}" class="detail-link text-decoration-none"><span class="review-span">Details</span></router-link> 
  </div>
  <div class="movie-ratings d-flex flex-column">
    <div class="d-flex justify-content-center" style="margin-top: 0.8rem;">
      <StarRating :rating="picked_movie.vote_average"/>
    </div>
    <ZingChart />
  </div>
</div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import StarRating from '@/components/StarRating.vue'
import ZingChart from '@/components/ZingChart.vue'

export default {
  name: 'MovieInfoBox',
  components: {
    StarRating,
    ZingChart
  },
  setup() {
    // Vuex
    const store = useStore()
    const picked_movie = computed(() => store.state.movies.picked_movie)

    return {
      picked_movie
    }
  },
}
</script>

<style scoped>
.movie-year {
  height: 2rem;
}
.movie-info-box {
  /* background: rgb(255, 255, 255, 0.7); */
  background: rgb(0, 0, 0, 0.7);
  display: block;
  position: fixed;
  z-index: 50;
  left: 50%;
  top: 50%;
  transform: translate(-20%, -50%);
  /* font-size: 50px; */
  font-family: Helvetica, Arial, "sans-serif";
  width: 50vw;
  height: 50vh;
  max-height: 60vh;
  text-align: center;
  color: white;
  text-decoration: none;
  /* line-height: 50px; */
  border-radius: 10px;
  text-align: left;
  overflow-x: hidden;
  overflow-y: hidden;
}


.movie-general-info-div {
  width: 30vw;
  padding: 3vw;
}

.movie-ratings {
  width: 20vw;
  padding: 2vw;
  padding-right: 3vw;
  padding-top: 3.8vw;
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

.review-span:hover {
  animation: colorToggle 0.5s ease-in-out infinite;
}

@keyframes colorToggle {
  0% {
    color: cornflowerblue;
  }
  50% {
    color: rgb(15 96 241)
  }
  100% {
    color: cornflowerblue;
  }
}

/* .review-a {
  line-decoration: none;
} */

.detail-link {
  font-size: 1.5rem;
}
</style>