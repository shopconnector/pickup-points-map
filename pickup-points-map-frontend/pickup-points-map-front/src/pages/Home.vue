<template>
  <div class="widget-view">
    <div class="header-view hidden-xs" v-if="$store.state.WidgetVersion">
      <select-location/>
    </div>
    <div class="container-map">
      <!-- MOBILE HEADER START -->
      <div class="mobile-header visible-xs">
        <div class="mobile-container">
          <i class="lejek-icon visible-xs" @click="openFilters = 1"></i>
        </div>
      </div>
      <vue-over-body :dim="false" :open="openFilters" before="beforeFilters" after="afterFilters" :transition="0.3">
        <div>
          <Filters/>
        </div>
      </vue-over-body>
      <!-- MOBILE HEADER END -->
      <Map/>
      <div class="mobile-footer visible-xs">
        <i class="button-footer" @click="openFooterModal"/>
      </div>
          <!-- Lis Modal Footer -->
    <div class="list-modal-footer visible-xs">
      <p class="footer-btn">WYBIERZ TEN PUNKT</p>
    </div>
    <!-- List Modal Footer End -->
    </div>
    <div class="features-div" :class="{ 'first' : !$store.state.WidgetVersion }">
      <div :class="{ 'features-box-ver2' : !$store.state.WidgetVersion }">
        <select-location v-if="!$store.state.WidgetVersion"/>
        <Filters/>
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
      openFilters: 0
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

<style lang="scss" >
// Mobile styles
.beforeFilters{
  top: -100vh;
  width: 100%;
  height: 100vh;
  background-color: #FFFFFF;
}
.afterFilters{
  top: 0;
}
.before {
  bottom: -100vh;
  width: 100%;
  height: 200px;
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
// MOBILE
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
  background: url(../assets/lejek.png) 0 0 no-repeat;
  &:after{
    content: '2';
    position: absolute;
    bottom: -10px;
    right: -11px;
    background-color: #E54C69;
    color: #FFFFFF;
    padding: 3px 7px;
    border-radius: 50%;
    font-size: 14px;
  }
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
.list-modal-footer{
  position: fixed;
  background-color: white;
  z-index: 1001;
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
    bottom: 20px;
    right: 105px;
    padding: 10px 12px;
  }
}
</style>
