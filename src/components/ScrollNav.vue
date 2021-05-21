<template>
  <nav>
    <ul>
      <li><button @click="onClickNavMenu('sci_fi')">Sci-fi</button></li>
      <li><button @click="onClickNavMenu('romance')">Romance</button></li>
      <li><button @click="onClickNavMenu('animation')">Animation</button></li>
      <li><button @click="onClickNavMenu('comedy')">Comedy</button></li>
      <li><button @click="onClickNavMenu('action')">Action</button></li>
      <li><button @click="onClickNavMenu('horror')">Horror</button></li>
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
  z-index: -1;
}
</style>