<template>
  <div class="movie-info-box">
    <button class="close" @click="onResetPickImage">X</button>
    <p>Movie title</p>
    <p>Movie ratings</p>
    <a href="#">Movie Details</a>
  </div>
</template>

<script>
export default {
  name: 'MovieInfoBox',
  setup(props, { emit }) {
    const onResetPickImage = () => {
      emit('onResetPickImage')
    }

    return {
      onResetPickImage
    }
  }
}
</script>

<style>
.movie-info-box {
  background: rgb(218, 218, 218);
  position: fixed;
  z-index: 50;
  left: 50%;
  top: 50%;
  transform: translate(-20%, -50%);
  font-size: 50px;
  font-family: Helvetica, Arial, "sans-serif";
  width: 50vw;
  height: 50vh;
  text-align: center;
  color: rgb(31, 31, 31);
  text-decoration: none;
  line-height: 50px;
  display: block;
}

.close {
  left: 43%;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>