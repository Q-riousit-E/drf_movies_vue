<template>
  <div class="rating-container">
    <div class="start-rating-container">
      <div class="stars" :style="`--rating: ${rating};`" aria-label="Rating of this product is 2.3 out of 5."></div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: "StarRatingSearchBar",
  props: {
    rating: Number
  },
  setup(props) {
    const rating = computed(() => {
      return props.rating
    })

    return {
      rating
    }
  }
}
</script>

<style lang="scss">
.rating-container {
  display: flex;
  justify-content: space-around;
}
.start-rating-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tmdb-logo {
  width: 6vh;
  height: 6vh;
  border-radius: 10%;
}

:root {
  --star-size: 1rem;
  --star-color: #fff;
  --star-background: rgb(211 196 62);
}

.stars {
  --percent: calc(var(--rating) / 5 * 100%);
  
  display: inline-block;
  font-size: var(--star-size);
  font-family: Times; // make sure ★ appears correctly
  line-height: 1;
  
  &::before {
    font-family: "Font Awesome 5 Free";
    // content: '★★★★★';
    content: '\f005\f005\f005\f005\f005';
    // font-weight: 400;    // for hollow stars
    font-weight: 900;
    letter-spacing: 3px;
    background: linear-gradient(90deg, var(--star-background) var(--percent), var(--star-color) var(--percent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>