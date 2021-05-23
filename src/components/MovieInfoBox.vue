<template>
<div class="container movie-info-box d-flex flex-row p-5">
  <div class="movie-general-info-div">
    <h3>{{ picked_movie.title }}</h3>
    <p class="movie-year"><b>{{ picked_movie.release_date.substring(0, 4) }}</b></p>
    <!-- FIX NEEDED: get hashtag data from db -->
    <span class="hashtags">sci-fi</span>
    <span class="hashtags">action</span>
    <!-- FIX NEEDED: cut sentence witha whole word -->
    <p class="movie-overview mt-4">{{ picked_movie.overview.substring(0, 220) + '...' }}</p>
    <hr>
    <p><span class="role-span">Director : </span> Christopher Nolan</p>
    <p><span class="role-span">Cast : </span> Tom Cruise, Lebron James, Harry Potter</p> 
    <p><span class="role-span">Subscription : </span> Netflix</p> 
    <hr>
    <a href="#" class="text-decoration-none"><span class="review-span">Write a Review</span></a> 
  </div>
  <div class="movie-ratings">
    <StarRating :rating="picked_movie.vote_average"/>
    <ZingChart />
  </div>
</div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import StarRating from '@/components/StarRating.vue'
import ZingChart from '@/components/ZingChart.vue'

export default {
  name: 'MovieInfoBox',
  components: {
    StarRating,
    ZingChart
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

<style scoped>
.movie-year {
  height: 2rem;
}
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
  width: 25vw;
}

.movie-ratings {
  width: 17vw;
  padding-left: 6vw;
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

/* .review-a {
  line-decoration: none;
} */
</style>