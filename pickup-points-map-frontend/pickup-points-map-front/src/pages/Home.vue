<template>
  <div class="widget-view">
    <div class="header-view hidden-xs" v-if="$store.state.WidgetVersion">
      <select-location/>
    </div>
    <div class="container-map">
      <div class="mobile-header visible-xs">header</div>
      <Map/>
      <div class="mobile-footer visible-xs">
        footer
        <button @click="open = 1">&times;</button>
      </div>
    </div>
    <div class="features-div hidden-xs" :class="{ 'first' : !$store.state.WidgetVersion }">
      <div :class="{ 'features-box-ver2' : !$store.state.WidgetVersion }">
        <select-location v-if="!$store.state.WidgetVersion"/>
        <filters/>
      </div>
    </div>
     <vue-over-body :dim="false" :open="open" before="before" after="after" :transition="0.3">
      <div>
        <button @click="open = 0">&times;</button>
        <p>A little alert message!</p>
        <p>For the users of your app!</p>
      </div>
    </vue-over-body>
  </div>
</template>

<script>
import router from 'vue-router'
import vueHeadful from 'vue-headful'
import SelectLocation from '../components/features/SelectLocation.vue'
import Filters from '../components/features/Filters.vue'
import Map from '../components/Map/LeafletMap.vue'
import vueOverBody from 'vue-over-body'

export default {
  name: 'Home',
  components: {
    router,
    vueHeadful,
    SelectLocation,
    Filters,
    Map,
    vueOverBody
  },
  data () {
    return {
      open: 1
    }
  },
  computed: {
    isWidgetVersion () {
      return this.$store.state.WidgetVersion
    }
  }
}
</script>

<style lang="scss" >
.before {
  bottom: -100vh;
  width: 100%;
  height: 200px;
  // z-index: 1 !important;
  margin-top: calc( 100vh - 200px);
  background-color:yellow;
  position:absolute;
}

.after {
  bottom: 0;
}
.over_body_mask {
 z-index: 1001 !important;
 overflow-y: hidden !important;
}
</style>

<style lang="scss" scoped>
.home-page{
  display: flex;
}
.widget-view{
  display: flex;
  flex-wrap: wrap;
}
.features-div{
  width: 55%;
}
.container-map{
  width: 45%;
  @media (max-width: 767px) {
    width: 100%;
  }
}
.header-view{
  width: 100%;
  display: flex;
  margin: 14px 20px 10px 20px;
  z-index: 999;
}
.features-box-ver2 {
  margin: 20px 40px 0 40px;
}
.first {
  order: -1;
}
.mobile-header {
  position: fixed;
  background-color: white;
  z-index: 401;
  left: 0;
  right: 0;
  top: 0;
  height: 70px;
  box-shadow: -1px 3px 10px 0px #b5b5b5;
}
.mobile-footer {
  position: fixed;
  background-color: white;
  z-index: 1000;
  left: 0;
  right: 0;
  bottom: 0;
  height: 35px;
  box-shadow: 1px -3px 10px 0px #b5b5b5;
  text-align: center;
}
</style>
