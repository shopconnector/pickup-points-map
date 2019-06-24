<template>
    <div class="home-page">
      <div class="map">
        <l-map :zoom="zoom" :center="center">
           <l-tile-layer :url="url" :attribution="attribution" />
        </l-map>
      </div>
      <div class="features">
        <!-- Select Suppliers Component -->
        <SelectSuppliers/>
        <!-- Select Location Component -->
        <SelectLocation/>
        <!-- Filters Component -->
        <Filters/>
      </div>
    </div>
</template>

<script>
import router from 'vue-router'
import vueHeadful from 'vue-headful'
import SelectSuppliers from '@/components/SelectSuppliers.vue'
import SelectLocation from '@/components/SelectLocation.vue'
import Filters from '@/components/Filters.vue'
// maps components
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet'
import { latLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'Home',
  components: {
    router,
    vueHeadful,
    SelectSuppliers,
    SelectLocation,
    Filters,
    // maps components
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },
  data () {
    return {
      zoom: 13,
      center: latLng(52.229676, 21.012229),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page{
  display: flex;
}
.features{
  margin: 60px 120px 120px 60px;
  width: 40%;
}
.map{
  width: 60%;
  height: 100vh;
  max-height: 100vh;
}
</style>
