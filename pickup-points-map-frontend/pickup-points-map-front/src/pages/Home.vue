<template>
  <div>
    <div v-if="!$store.state.keyError" class="main-enter-info">
      <p class="error-text">
        Dostęp zablokowany dla niezautoryzowanych użytkowników.
        <br>Jeśli interesuje cię użycie narzędzia PickupPoints, odwiedź
        <a href="https://www.punktyodbiorupaczek.pl" target="_blank">punktyodbiorupaczek.pl</a>
      </p>
    </div>
    <div v-else class="widget-view">
      <div class="header-view" v-if="isWidgetVersion">
        <select-location :innerAddress="innerAddress"/>
      </div>
      <div class="container-map">
        <div class="mobile-header" v-if="isMobile">
          <div class="mobile-container">
            <i class="lejek-icon" @click="openFilterMobile"  :data-content="filtersCount"></i>
          </div>
        </div>
        <vue-over-body :dim="false" :open="this.$store.state.isFilterMobileOpen" before="beforeFilters" after="afterFilters" :transition="0.3">
          <div v-if="isMobile" class="scroll-box-filters">
            <Filters :innerFilter="innerFilter"/>
          </div>
        </vue-over-body>
        <Map/>
        <div class="mobile-footer" v-if="!showListFooter && isMobile">
          <i class="button-footer" @click="openFooterModal"/>
        </div>
        <div class="list-modal-footer" v-if="showListFooter && isMobile">
          <p class="footer-btn" @click="setPoint($store.state.markerDetails)">WYBIERZ TEN PUNKT</p>
        </div>
      </div>
      <div class="features-div" :class="{ 'first' : !isWidgetVersion }">
        <div :class="{ 'features-box-ver2' : !isWidgetVersion }">
          <select-location v-if="!isWidgetVersion" :innerAddress="innerAddress"/>
          <Filters :innerFilter="innerFilter" v-if="!isMobile"/>
        </div>
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
import EventBus from '../event-bus'

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
      innerAddress: '',
      innerFilter: null
    }
  },
  created () {
    window.addEventListener('message', this.filterApply)
  },
  destroyed () {
    window.removeEventListener('message', this.filterApply)
  },
  methods: {
    filterApply: function (event) {
      if (event.data.content && event.data.content.hasOwnProperty('key')) {
        this.innerFilter = event.data.content.filter
        this.innerAddress = event.data.content.address
        this.$store.dispatch('get_essentials', {
          key: `${event.data.content.key}`,
          origin: `${event.origin}`
        })
      }
    },
    openFooterModal () {
      this.$store.commit('openFooterModal')
    },
    openFilterMobile () {
      if (this.$store.state.toogleModal === true) {
        EventBus.$emit('toogleMethodBus', false)
      }
      this.$store.commit('openFilterMobile')
      this.$store.commit('closeListFooter')
    },
    setPoint (point) {
      this.sendMessage(point)
    },
    sendMessage (point) {
      window.parent.postMessage(point, '*')
    }
  },
  computed: {
    filtersCount () {
      return this.$store.state.filtersCount
    },
    isWidgetVersion () {
      return this.$store.state.customer.theme
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
.main-enter-info {
  position: absolute;
  z-index: 1001;
  top: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: gray;
  @media (max-width: 767px) {
    top: 70px;
  }
  p {
    margin: 0;
    padding: 15px;
    border-radius: 5px;
    color: #e4405f;
    font-weight: 700;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
  }
  a {
    padding-top: 5px;
  }
}
.scroll-box-filters{
  height: 100%;
  width: 100%;
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
    @media (max-width: 414px ) {
      bottom: 26px;
    }
    @media (max-width: 375px) {
      bottom: 20px;
    }
    @media (max-width: 320px) {
      bottom: 12px;
    }
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
    bottom: 20px;
    right: calc(50% - 85px);
    padding: 10px 12px;
    @media (max-width: 414px ) {
      bottom: 25px;
      right: calc(50% - 92px);
      padding: 12px 20px;
    }
    @media (max-width: 375px ) {
      bottom: 20px;
      right: calc(50% - 85px);
      padding: 10px 12px;
    }
    @media (max-width: 320px) {
      bottom: 18px;
      right: calc(50% - 80px);
      padding: 8px;
    }
  }
}
</style>
