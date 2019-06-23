<template>
    <div class="home-page">
      <!-- Select Suppliers Component -->
      <SelectSuppliers/>
      <!-- Select Location Component -->
      <SelectLocation/>
    </div>
</template>

<script>
import router from 'vue-router'
import vueHeadful from 'vue-headful'
import SelectSuppliers from '@/components/SelectSuppliers.vue'
import SelectLocation from '@/components/SelectLocation.vue'

export default {
  components: {
    router,
    vueHeadful,
    SelectSuppliers,
    SelectLocation
  },
  data () {
    return {

    }
  },
  name: 'Home'
}
</script>

<style lang="scss" scoped>

</style>
