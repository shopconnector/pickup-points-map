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

<style lang='scss'>
@import url('https://use.typekit.net/ewq5ack.css');
@import '@/assets/_variables.scss';

body{
  margin: 0;
  height: 100%;
  max-height: 100%;
  width: 100%;
  padding: 0;
  /* overflow-x:hidden; */
}
#app {
  font-family: $main-font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-black;
}
input {
  outline:none;
}
/* width */
::-webkit-scrollbar {
  width: 4px;
  height: 3px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: $red;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: $red;
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
