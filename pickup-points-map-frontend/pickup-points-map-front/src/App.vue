<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body{
  margin: 0;
  height: 100%;
  max-height: 100%;
  width: 100%;
  padding: 0;
  /* overflow-x:hidden; */
}
#app {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #303030;
}
input {
  outline:none;
}
/* width */
::-webkit-scrollbar {
  width: 4px;
  height: 3px;
}
/* Track */
::-webkit-scrollbar-track {
  /* background: #ffffff; */
  /* background: #e0e0e0; */
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #E54C69;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #E54C69;
}
.visible-xs {
  display: none;
}
.hidden-xs {
  display: block;
}
@media (max-width: 767px) {
  .visible-xs {
    display: block;
  }
  .hidden-xs {
    display: none !important;
  }
}
</style>
