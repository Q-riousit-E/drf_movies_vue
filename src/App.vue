<template>
  <div>
    <!-- <transition name="fade"> -->
    <!-- <MainNav v-if="mainNavShow" /> -->
    <MainNav />
    <!-- </transition> -->
  </div>
  <!-- FIX NEEDED: main nav not available when entered from not home -->
  <!-- <router-view @showMainNav="showMainNav" @hideMainNav="hideMainNav" v-slot="{ Component }">
    <transition name="route" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view> -->
  <!-- <router-view @showMainNav="showMainNav" @hideMainNav="hideMainNav" /> -->
  <router-view />
</template>

<script>
import { defineComponent, ref } from 'vue'
import gsap from 'gsap'
import Home from '@/views/Home.vue'
import MainNav from '@/components/MainNav.vue'

export default defineComponent({
  components: {
    MainNav
  },
  setup() {
    // hidden navbar for first load
    const mainNavShow = ref(true)
    // const showMainNav = () => {
		// 	console.log('showmainnav')
    //   mainNavShow.value = true
    // }
    // const hideMainNav = () => {
		// 	console.log('hidemainnav')
    //   mainNavShow.value = false
    // }

    // custom cursor
    function lerp(start, end, amount) {
      return (1-amount)*start+amount*end
    }
    const cursor = document.createElement('div');
    cursor.className = 'cursor';

    const cursorF = document.createElement('div');
    cursorF.className = 'cursor-f';
    let cursorX = 0;
    let cursorY = 0;
    let pageX = 0;
    let pageY = 0;
    let size = 8;
    let sizeF = 36;
    let followSpeed = .16;

    document.body.appendChild(cursor);
    document.body.appendChild(cursorF);

    if ('ontouchstart' in window) {
      cursor.style.display = 'none';
      cursorF.style.display = 'none';
    }

    cursor.style.setProperty('--size', size+'px');
    cursorF.style.setProperty('--size', sizeF+'px');

    window.addEventListener('mousemove', function(e) {
      pageX = e.clientX;
      pageY = e.clientY;
      cursor.style.left = e.clientX-size/2+'px';
      cursor.style.top = e.clientY-size/2+'px';
    });

    function loop() {
      cursorX = lerp(cursorX, pageX, followSpeed);
      cursorY = lerp(cursorY, pageY, followSpeed);
      cursorF.style.top = cursorY - sizeF/2 + 'px';
      cursorF.style.left = cursorX - sizeF/2 + 'px';
      requestAnimationFrame(loop);
    }

    loop();

    let startY;
    let endY;
    let clicked = false;

    function mousedown(e) {
      gsap.to(cursor, {scale: 4.5});
      gsap.to(cursorF, {scale: .4});

      clicked = true;
      startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
    }
    function mouseup(e) {
      gsap.to(cursor, {scale: 1});
      gsap.to(cursorF, {scale: 1});

      endY = e.clientY || endY;
    }
    window.addEventListener('mousedown', mousedown, false);
    window.addEventListener('touchstart', mousedown, false);
    window.addEventListener('touchmove', function(e) {
      if (clicked) {
        endY = e.touches[0].clientY || e.targetTouches[0].clientY;
      }
    }, false);
    window.addEventListener('touchend', mouseup, false);
    window.addEventListener('mouseup', mouseup, false);

    return {
      mainNavShow, 
      // showMainNav, hideMainNav,
      Home
    }
  },
})
</script>

<style>
* {
  cursor: none;
  /* user-select: none; */
  -webkit-user-drag: none;
}

p {
  margin: 0;
}

body, html {
  background: rgb(30, 40, 42);
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #181818;
  height: 100%;
  overflow: hidden;
}

/* Cursor */
.cursor {
	 width: var(--size);
	 height: var(--size);
	 border-radius: 50%;
	 background: white;
	 position: absolute;
	 z-index: 999;
	 pointer-events: none;
	 mix-blend-mode: difference;
}
 .cursor-f {
	 width: var(--size);
	 height: var(--size);
	 position: absolute;
	 top: 0;
	 left: 0;
	 background-image: url("data:image/svg+xml,%3Csvg width='47' height='47' viewBox='0 0 47 47' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M42.4202 42.4202C38.8403 46 33.3594 46 23.5 46C13.6406 46 8.15966 46 4.57983 42.4202C1 38.8403 1 33.3594 1 23.5C1 13.6406 1 8.15966 4.57983 4.57983C8.15966 1 13.6406 1 23.5 1C33.3594 1 38.8403 1 42.4202 4.57983C46 8.15966 46 13.6406 46 23.5C46 33.3594 46 38.8403 42.4202 42.4202Z' stroke='white'/%3E%3C/svg%3E%0A");
	 background-size: cover;
	 mix-blend-mode: difference;
	 pointer-events: none;
	 opacity: .5;
	 z-index: 999;
}

/* Transition */
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}

.fade-enter-active {
	transition: opacity 0.6s ease;
}

.fade-leave-active {
  transition: opaticy 0.1s linear;
}

.route-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.route-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.route-enter-active,
.route-leave-active {
  transition: all 0.3s ease-in;
}
</style>
