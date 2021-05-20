<template>
  <nav>
    <ul>
      <li><button @click="onClickNavMenu('Sci-fi')">Sci-fi</button></li>
      <li><button @click="onClickNavMenu('Romance')">Romance</button></li>
      <li><button @click="onClickNavMenu('Animation')">Animation</button></li>
      <li><button @click="onClickNavMenu('Comedy')">Comedy</button></li>
      <li><button @click="onClickNavMenu('Action')">Action</button></li>
      <li><button @click="onClickNavMenu('Horror')">Horror</button></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'ScrollNav',
  setup(props, {emit}) {
    const onClickNavMenu = (genre) => {
      emit('onClickNavMenu', genre)
    }

    return {
      onClickNavMenu
    }
  }
}
</script>

<style scoped>
nav {
  transform: translate(0%, -50%);
  opacity: 1;
  position: fixed;
  display: block;
  top: 20%;
  right: 15px;
  z-index: 3;
}
</style>