<template>
  <div id="nav">
    <router-link :to="{ name: 'Home' }">Home</router-link> |
    <router-link :to="{ name: 'Articles' }">Articles</router-link> |
    <router-link :to="{ name: 'Signup' }">Signup</router-link> |
    <router-link :to="{ name: 'Login' }">Login</router-link> | 
    <router-link :to="{ name: 'Logout' }">Logout</router-link> |
    <router-link :to="{ name: 'Testing' }">Testing</router-link> 

  </div>
  <router-view/>
</template>

<style>
body {
  background: black;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  position: relative;
  z-index: 3;
}

#nav a {
  font-weight: bold;
  color: rgb(204, 204, 204);
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
