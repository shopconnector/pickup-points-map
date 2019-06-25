<template>
    <div class="widget-view">
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
import SelectSuppliers from './features/SelectSuppliers'
import SelectLocation from './features/SelectLocation.vue'
import Filters from './features/Filters.vue'
// maps components
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet'
import { latLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'WidgetView',
  components: {
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
.widget-view{
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
