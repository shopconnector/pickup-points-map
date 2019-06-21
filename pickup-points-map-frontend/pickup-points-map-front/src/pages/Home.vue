<template>
    <div class="home-page">
      <SelectSuppliers/>
    </div>
</template>

<script>
import router from 'vue-router'
import vueHeadful from 'vue-headful'
import SelectSuppliers from '@/components/SelectSuppliers.vue'

export default {
  components: {
    router,
    vueHeadful,
    SelectSuppliers
  },
  data () {
    return {

    }
  },
  name: 'Home'
}
</script>

<style>

</style>
