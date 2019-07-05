<template>
  <div>
    <!-- <div v-if="isMobileDevice()">
      <h1>This is Mobile</h1>
    </div> -->
    <div class="widget-view">
      <div class="header-view">
        <!-- Select Location Component -->
        <SelectLocation/>
      </div>
      <div class="container-map">
        <Map/>
      </div>
      <div class="features">
        <Filters/>
      </div>
    </div>
  </div>
</template>

<script>
import SelectLocation from './features/SelectLocation.vue'
import Filters from './features/Filters.vue'
import Map from './Map/LeafletMap.vue'

export default {
  name: 'WidgetView',
  components: {
    SelectLocation,
    Filters,
    Map
  },
  data () {
    return {
    }
  },
  methods: {
    // isMobileDevice () {
    //   return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)
    // }
  }
}
</script>

<style lang="scss" scoped>
.widget-view{
  display: flex;
  flex-wrap: wrap;
}
.features{
  width: 55%;
}
.container-map{
  width: 45%;
}
.header-view{
  width: 100%;
  display: flex;
  margin: 14px 20px 10px 20px;
  z-index: 999;
}
</style>
