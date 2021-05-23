<template>
  <nav>
    <a class="nav-item is-active" active-color="orange" @click="onClickNavMenu('sci_fi')" data-genre="sci_fi">Sci-fi</a>
    <a class="nav-item" active-color="orangered" @click="onClickNavMenu('romance')" data-genre="romance">Romance</a>
    <a class="nav-item" active-color="greenyellow" @click="onClickNavMenu('animation')" data-genre="animation">Animation</a>
    <a class="nav-item" active-color="royalblue" @click="onClickNavMenu('action')" data-genre="action">Action</a>
    <a class="nav-item" active-color="rebeccapurple" @click="onClickNavMenu('horror')" data-genre="horror">Horror</a>
    <span class="nav-indicator"></span>
  </nav>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex'

export default {
  name: 'ScrollNav',
  props: ['currMovieGenre'],
  setup(props, {emit}) {
    // get currMovieGenre data from store
    const store = useStore()
    const currMovieGenre = computed(() => store.state.movies.currMovieGenre)

    // scrolling changes chosen tab
    watch(currMovieGenre, () => {
      const indicator = document.querySelector('.nav-indicator')
      const items = document.querySelectorAll('.nav-item')
      let item
      items.forEach((ele) => {
        if (ele.dataset.genre === currMovieGenre.value) {
          item = ele
        }
      })
      handleIndicator(indicator, items, item)

    })

    // navbar click changes scroll in three
    const onClickNavMenu = (genre) => {
      emit('onClickNavMenu', genre)
    }
    
    // change indicator when tab clicked or scroll changed in three
    const handleIndicator = (indicator, items, el) => {
      items.forEach(item => {
        item.classList.remove('is-active')
        item.removeAttribute('style')
      })
    
      indicator.style.width = `${el.offsetWidth}px`
      indicator.style.left = `${el.offsetLeft}px`
      indicator.style.backgroundColor = el.getAttribute('active-color')
      el.classList.add('is-active')
      el.style.color = el.getAttribute('active-color')
    }

    onMounted(() => {
      const indicator = document.querySelector('.nav-indicator')
      const items = document.querySelectorAll('.nav-item')
  
      items.forEach((item) => {
        item.addEventListener('click', (e) => { handleIndicator(indicator, items, e.target)})
        item.classList.contains('is-active') && handleIndicator(indicator, items, item)
      })
    })

    return {
      onClickNavMenu
    }
  }
}
</script>

<style scoped>
* {
	 box-sizing: border-box;
}

nav {
  top: 11%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
  position: fixed;
  display: flex;
  z-index: 3;
  box-shadow: 0 10px 40px rgba(159, 162, 177, .8);
	border-radius: 10px;
}

 .nav-item {
	 color: #83818c;
	 padding: 20px;
	 text-decoration: none;
	 transition: 0.3s;
	 margin: 0 6px;
	 z-index: 1;
	 font-family: 'DM Sans', sans-serif;
	 font-weight: 700;
	 position: relative;
}
 .nav-item:before {
	 content: "";
	 position: absolute;
	 bottom: -6px;
	 left: 0;
	 width: 100%;
	 height: 5px;
	 background-color: #dfe2ea;
	 border-radius: 8px 8px 0 0;
	 opacity: 0;
	 transition: 0.3s;
}
 .nav-item:not(.is-active):hover:before {
	 opacity: 1;
	 bottom: 0;
}
 .nav-item:not(.is-active):hover {
	 color: rgb(255, 255, 255);
}
 .nav-indicator {
	 position: absolute;
	 left: 0;
	 bottom: 0;
	 height: 4px;
	 transition: 0.4s;
	 z-index: 1;
	 border-radius: 8px 8px 0 0;
}
 @media (max-width: 580px) {
	 .nav {
		 overflow: auto;
	}
}
 
</style>