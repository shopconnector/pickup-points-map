<template>
    <div class="widget-view-v2">
      <div class="features">
        <!-- SelectSuppliersView Component -->
        <SelectSuppliersV2/>
        <!-- SelectLocationView Component -->
        <SelectLocationV2/>
        <!-- FiltersView Component -->
        <FiltersV2/>
        <!-- ModalDivView Component -->
        <ModalDivV2/>
      </div>
      <div class="map">
        <l-map :zoom="zoom" :center="center">
           <l-tile-layer :url="url" :attribution="attribution" />
        </l-map>
      </div>
    </div>
</template>

<script>
import SelectSuppliersV2 from './features/SelectSuppliersV2.vue'
import SelectLocationV2 from './features/SelectLocationV2.vue'
import FiltersV2 from './features/FiltersV2.vue'
import ModalDivV2 from './features/ModalDivV2.vue'
// maps components
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet'
import { latLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'WidgetViewV2',
  components: {
    SelectSuppliersV2,
    SelectLocationV2,
    FiltersV2,
    ModalDivV2,
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
.widget-view-v2{
   display: flex;
}
.features{
   width: 45%;
   margin: 40px 80px 0 80px;
 }
 .map{
  width: 55%;
  height: 100vh;
  max-height: 100vh;
}
</style>
