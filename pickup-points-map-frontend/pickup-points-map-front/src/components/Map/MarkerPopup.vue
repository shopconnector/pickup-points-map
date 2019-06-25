<template>
  <l-marker :lat-lng="position" :title="title" :draggable="false">
    <l-popup :content="text" />
  </l-marker>
</template>

<script>
import { LMarker, LPopup } from 'vue2-leaflet'
import { latLng } from 'leaflet'

export default {
  name: 'MarkerPopup',
  components: {
    LMarker,
    LPopup
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    position: {
      type: Object,
      default: latLng(47.413220, -1.319482)
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
