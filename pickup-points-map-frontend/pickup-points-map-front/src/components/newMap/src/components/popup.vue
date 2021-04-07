<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import L from 'leaflet'
import EventBus from './../bus'
import eventsBinder from '../util/eventsBinder'

const events = [
  'add',
  'remove',
  'popupopen',
  'popupclose',
  'tooltipopen',
  'tooltipclose'
]

const props = {
  bare: Boolean,
  content: {
    default: ''
  },
  latLng: {
    type: [Object, Array]
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
    vm.lmap = L.popup(vm.options)
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
    if (vm.$parent.getPopup && vm.$parent.getPopup()) {
      vm.$parent.unbindPopup()
    }
  },
  methods: {
    add (lmap) {
      let vm = this
      vm.lmap.setContent(this.content || this.$el)
      lmap.bindPopup(vm.lmap)
    }
  }
}

</script>
