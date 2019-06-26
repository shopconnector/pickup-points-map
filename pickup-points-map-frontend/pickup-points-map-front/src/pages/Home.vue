<template>
    <div class="home-page">
      <leaflet-map/>
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
import LeafletMap from '@/components/Map/LeafletMap.vue'

export default {
  name: 'Home',
  components: {
    router,
    vueHeadful,
    SelectSuppliers,
    SelectLocation,
    Filters,
    LeafletMap
  },
  data () {
    return {
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
</style>
