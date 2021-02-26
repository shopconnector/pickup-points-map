<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

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
  background: $placeholder-grey;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: $placeholder-grey;
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
