<template>
  <div class="widget-view">
    <div class="header-view" v-if="$store.state.WidgetVersion">
      <select-location/>
    </div>
    <div class="container-map">
      <div class="mobile-header" v-if="isMobile">
        <div class="mobile-container">
          <i class="lejek-icon" @click="openFilterMobile"  :data-content="filtersCount"></i>
        </div>
      </div>
      <vue-over-body :dim="false" :open="this.$store.state.isFilterMobileOpen" before="beforeFilters" after="afterFilters" :transition="0.3">
        <div v-if="isMobile">
          <Filters/>
        </div>
      </vue-over-body>
      <Map/>
      <div class="mobile-footer" v-if="!showListFooter && isMobile">
        <i class="button-footer" @click="openFooterModal"/>
      </div>
      <div class="list-modal-footer" v-if="showListFooter && isMobile">
        <p class="footer-btn">WYBIERZ TEN PUNKT</p>
      </div>
    </div>
    <div class="features-div" :class="{ 'first' : !$store.state.WidgetVersion }">
      <div :class="{ 'features-box-ver2' : !$store.state.WidgetVersion }">
        <select-location v-if="!$store.state.WidgetVersion"/>
        <Filters v-if="!isMobile"/>
      </div>
    </div>
  </div>
</template>

<script>
import router from 'vue-router'
import vueHeadful from 'vue-headful'
import SelectLocation from '../components/features/SelectLocation.vue'
import Filters from '../components/features/Filters.vue'
import Map from '../components/Map/LeafletMap.vue'
import vueOverBody from 'vue-over-body'
import { MobileDetected } from '../components/mobileDetected.ts'

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
  mixins: [MobileDetected],
  data () {
    return {
    }
  },
  methods: {
    openFooterModal () {
      this.$store.commit('openFooterModal')
    },
    openFilterMobile () {
      this.$store.commit('openFilterMobile')
      this.$store.commit('closeListFooter')
    }
  },
  computed: {
    filtersCount () {
      return this.$store.state.filtersCount
    },
    isWidgetVersion () {
      return this.$store.state.WidgetVersion
    },
    showListFooter () {
      return this.$store.state.showListFooter
    }
  }
}
</script>

<style lang="scss" >
.beforeFilters{
  top: -100%;
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
}
.afterFilters{
  top: 0;
}
.before {
  bottom: -100%;
  width: 100%;
  height: 200px;
  margin-top: calc( 100% - 200px);
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
.scroll-box-filters{
  height: 100%;
  overflow-y: scroll;
}
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
    z-index: 999;
    height: 110px;
    align-items: center;
    padding: 0 20px;
  @media (max-width: 767px) {
    margin: 0;
    z-index: auto;
    width: auto;
    height: auto;
    padding: 0;
  }
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
.mobile-container{
  display: flex;
  align-items: center;
  height: 70px;
}
.lejek-icon {
  position: relative;
  margin-left: 20px;
  width: 35px;
  height: 30px;
  background: url(../assets/icons/lejek.png) 0 0 no-repeat;
  &:after{
    content: attr(data-content);
    position: absolute;
    bottom: -10px;
    right: -11px;
    background-color: #E54C69;
    color: #FFFFFF;
    border-radius: 50%;
    font-size: 14px;
    display: flex;
    width: 23px;
    justify-content: center;
    align-items: center;
    height: 23px;
  }
}
.mobile-footer {
  .button-footer {
    cursor: pointer;
    background-color: white;
    width: 40px;
    height: 40px;
    bottom: 20px;
    left: calc( 50% - 20px);
    position: absolute;
    background: url('../assets/icons/Group-12.png') 0 0 no-repeat;
    background-size: cover;
  }
  position: fixed;
  background-color: white;
  z-index: 1000;
  left: 0;
  right: 0;
  bottom: 0;
  height: 90px;
  text-align: center;
  background: url('../assets/Path-1122.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: bottom;
}
.list-modal-footer{
  position: fixed;
  background-color: white;
  z-index: 999;
  left: 0;
  right: 0;
  bottom: 0;
  height: 90px;
  // box-shadow: 1px -3px 10px 0px #b5b5b5;
  text-align: center;
  background: url('../assets/footer.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: bottom;
  .footer-btn{
    position: absolute;
    font-size: 14px;
    color: #FFFFFF;
    background-color: #E4405F;
    border-radius: 9px;
    margin: 0;
    bottom: calc(50% - 25px);
    right: calc(50% - 85px);
    padding: 10px 12px;
  }
}
</style>
