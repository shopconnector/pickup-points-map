<template>
    <div>
      <template v-if="isWidgetVersion">
        <!-- First version of the widget -->
        <WidgetView/>
      </template>
      <template v-else>
        <!-- Second version of the widget -->
        <WidgetViewV2/>
      </template>
    </div>
</template>

<script>
import router from 'vue-router'
import vueHeadful from 'vue-headful'
import WidgetView from '@/components/WidgetView.vue'
import WidgetViewV2 from '@/components/WidgetViewV2.vue'

export default {
  name: 'Home',
  components: {
    router,
    vueHeadful,
    WidgetView,
    WidgetViewV2
  },
  data () {
    return {
      isWidgetVersion: false
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
