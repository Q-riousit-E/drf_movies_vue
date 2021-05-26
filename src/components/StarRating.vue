<template>
  <div class="rating-container">
    <div class="start-rating-container">
      <!-- <h4><b>{{ rating }}</b></h4> -->
      <div class="Stars" :style="`--rating: ${rating};`" aria-label="Rating of this product is 2.3 out of 5."></div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: "StarRating",
  props: {
    rating: Number
  },
  setup(props) {
    const rating = computed(() => {
      console.log('this the right place')
      return props.rating
    })

    return {
      rating
    }
  }
}
</script>

<style lang="scss" scoped>
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

:root {
  --star-size: 2rem;
  --star-color: #fff;
  --star-background: rgb(14, 115, 149);
}

.Stars {
  --percent: calc(var(--rating) / 5 * 100%);
  
  display: inline-block;
  font-size: 2rem;
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