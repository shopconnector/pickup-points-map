<template>
    <div class="widget-view-v2">
      <div class="features">
        <!-- SelectLocationView Component -->
        <SelectLocationV2/>
        <!-- SelectSuppliersView Component -->
        <SelectSuppliersV2/>
        <!-- FiltersView Component -->
        <FiltersV2/>
        <!-- ModalDivView Component -->
        <!-- <ModalDivV2/> -->
      </div>
      <div class="container-map">
         <Map/>
      </div>
    </div>
</template>

<script>
import SelectSuppliersV2 from './features/SelectSuppliersV2.vue'
import SelectLocationV2 from './features/SelectLocationV2.vue'
import FiltersV2 from './features/FiltersV2.vue'
// import ModalDivV2 from './features/ModalDivV2.vue'
import Map from './Map/LeafletMap.vue'

export default {
  name: 'WidgetViewV2',
  components: {
    SelectSuppliersV2,
    SelectLocationV2,
    FiltersV2,
    // ModalDivV2,
    Map
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.widget-view-v2{
   display: flex;
}
.features{
   width: 55%;
   margin: 20px 40px 0 40px;
 }
 .container-map{
  width: 45%;
}
</style>
