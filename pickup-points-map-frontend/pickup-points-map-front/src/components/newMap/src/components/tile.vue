<template>
  <div></div>
</template>

<script>
import L from 'leaflet'
import EventBus from './../bus.js'

const props = {
  url: String,
  bare: Boolean,
  attribution: {
    type: String,
    custom: true
  },
  detectRetina: {
    type: Boolean,
    custom: false,
    default: false
  },
  token: {
    type: String,
    custom: true
  },
  opacity: {
    type: Number,
    custom: false,
    default: 1.0
  },
  zIndex: {
    type: Number,
    default: 1
  },
  options: {
    type: Object,
    default: function () {
      return {}
    }
  },
  tileLayerClass: {
    type: Function,
    default: L.tileLayer
  }
}

export default {
  props: props,
  mounted () {
    let vm = this
    vm.lmap = L.tileLayer(vm.url, vm.options)

    EventBus.$on('mounted', function (lmap) {
      if (vm.$parent._isMounted) {
        if (lmap._leaflet_id === vm.$parent.lmap._leaflet_id) {
          if (!vm.bare) {
            vm.lmap.addTo(vm.$parent.lmap)
          }
          EventBus.$emit('mounted', vm.lmap)
        }
      }
    })
  },
  methods: {
    add (lmap) {
      let vm = this
      vm.lmap.addTo(lmap)
    }
  }
}
</script>
