<template>
  <div class="widget-view">
    <div class="header-view hidden-xs" v-if="$store.state.WidgetVersion">
      <select-location/>
    </div>
    <div class="container-map">
      <div class="mobile-header visible-xs"></div>
      <Map/>
      <div class="mobile-footer visible-xs">
        <span  class="button-footer" @click="openFooterModal">
          <!-- a -->
        </span>
      </div>
    </div>
    <div class="features-div" :class="{ 'first' : !$store.state.WidgetVersion }">
      <div :class="{ 'features-box-ver2' : !$store.state.WidgetVersion }">
        <select-location v-if="!$store.state.WidgetVersion"/>
        <filters/>
      </div>
    </div>
    <!-- <vue-over-body :dim="false" :open="IsFooterModalOpen" before="before" after="after" :transition="0.3">
      <div>
        <button @click="closeFooterModal">&times;</button>
        <p>Bla bla!</p>
        <p>FBla bla!</p>
      </div>
    </vue-over-body> -->
  </div>
</template>

<script>
import router from 'vue-router'
import vueHeadful from 'vue-headful'
import SelectLocation from '../components/features/SelectLocation.vue'
import Filters from '../components/features/Filters.vue'
import Map from '../components/Map/LeafletMap.vue'
// import vueOverBody from 'vue-over-body'

export default {
  name: 'Home',
  components: {
    router,
    vueHeadful,
    SelectLocation,
    Filters,
    Map
    // vueOverBody
  },
  data () {
    return {
      open: 0
    }
  },
  methods: {
    openFooterModal () {
      this.$store.commit('openFooterModal')
    },
    closeFooterModal () {
      this.$store.commit('closeFooterModal')
    }
  },
  computed: {
    isWidgetVersion () {
      return this.$store.state.WidgetVersion
    },
    IsFooterModalOpen () {
      return this.$store.state.isFooterModalOpen
    }
  }
}
</script>

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
  @media (max-width: 767px) {
    width: auto;
  }
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
  @media (max-width: 767px) {
    margin: 0;
  }
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
  .button-footer {
        /* margin: 0 auto; */
    cursor: pointer;
    background-color: white;
    width: 40px;
    height: 40px;
    bottom: 20px;
    left: calc( 50% - 20px);
    position: absolute;
    background: url('../assets/Group-12.png') 0 0 no-repeat;
    background-size: cover;
  }
  position: fixed;
  background-color: white;
  z-index: 1000;
  left: 0;
  right: 0;
  bottom: 0;
  height: 90px;
  // box-shadow: 1px -3px 10px 0px #b5b5b5;
  text-align: center;
  background: url('../assets/Path-1122.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: bottom;
}
</style>
