<template>
    <div class="widget-view-v2">
      <div class="features">
          <div class="padd">
          <!-- SelectLocationView Component -->
          <SelectLocation/>
          <!-- SelectSuppliersView Component -->
          <SelectSuppliersV2/>
          <!-- FiltersView Component -->
          <Filters/>
        </div>
      </div>
      <div class="container-map">
         <Map/>
      </div>
    </div>
</template>

<script>
import SelectSuppliersV2 from './features/SelectSuppliersV2.vue'
import SelectLocation from './features/SelectLocation'
import Filters from './features/Filters.vue'
import Map from './Map/LeafletMap.vue'

export default {
  name: 'WidgetViewV2',
  components: {
    SelectSuppliersV2,
    SelectLocation,
    Filters,
    Map
  },
  data () {
    return {
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.widget-view-v2{
   display: flex;
}
.features{
   width: 55%;
 }
 .padd{
    margin: 20px 40px 0 40px;
 }
 .container-map{
  width: 45%;
}
</style>
