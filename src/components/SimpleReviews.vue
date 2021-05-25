<template>
  <div class="container-fluid simple-reviews-container">
    <div class="simple-review-write">
    </div>
    <div class="row simple-cards-container">
      <div v-for="(review, idx) in reviews" :key="idx" class="col-6 simple-card">
        <div class="simple-cards-outline">
          {{ review }}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SimpleReviews',
  setup() {
    const reviews = ref(Array.from(Array(20), (e, i) => 'review content'))

    return {
      reviews
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.simple-reviews-container {
  width: 50%;
  height: 100vh;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  padding: 1vw;
}

.simple-review-write {
  height: 10vh;
  background-color: blue;
}

.simple-cards-container {
  width: 100%;
  margin: 0;
}

.simple-cards-outline {
  min-height: 20vh;
  padding: 1vw;
}

.simple-card {
  color: black;
  border: 1px solid black;
}
</style>