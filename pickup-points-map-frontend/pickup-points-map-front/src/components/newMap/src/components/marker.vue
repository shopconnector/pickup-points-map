<template>
  <div style="display: none;">
    <slot></slot>
  </div>
</template>

<script>
import L from 'leaflet'
import EventBus from './../bus'
import eventsBinder from '../util/eventsBinder'

const events = [
  'click',
  'dblclick',
  'mousedown',
  'mouseover',
  'mouseout',
  'contextmenu',
  'dragstart',
  'drag',
  'dragend',
  'move',
  'add',
  'remove',
  'popupopen',
  'popupclose',
  'tooltipopen',
  'tooltipclose'
]

const props = {
  bare: {
    type: Boolean,
    custom: true,
    default: false
  },
  draggable: {
    type: Boolean,
    custom: true,
    default: false
  },
  visible: {
    type: Boolean,
    custom: true,
    default: true
  },
  latLng: {
    type: [Object, Array]
  },
  icon: {
    custom: false,
    default: () => new L.Icon.Default()
  },
  zIndexOffset: {
    type: Number,
    custom: false
  },
  options: {
    type: Object,
    default: () => ({})
  }
}

export default {
  props: props,
  mounted () {
    let vm = this

    const options = vm.options
    if (vm.icon) {
      options.icon = vm.icon
    }

    if (vm.draggable) {
      options.draggable = vm.draggable
    }

    vm.lmap = L.marker(this.latLng, vm.options)
    eventsBinder(vm, vm.lmap, events)
    EventBus.$on('mounted', add)

    function add (lmap) {
      if (vm.$parent._isMounted) {
        if (lmap._leaflet_id === vm.$parent.lmap._leaflet_id) {
          if (!vm.bare) {
            vm.add(vm.$parent.lmap)
          }
          EventBus.$emit('mounted', vm.lmap)
        }
      }
    }
  },
  beforeDestroy () {
    let vm = this
    if (!vm.bare) {
      vm.$parent.lmap.removeLayer(vm.lmap)
    }
  },
  methods: {
    add (lmap) {
      let vm = this
      vm.lmap.addTo(lmap)
    }
  }
}
</script>
