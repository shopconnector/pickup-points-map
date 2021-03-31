<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import L from 'leaflet'
import EventBus from './../bus'
import 'leaflet.markercluster'

export default {
  props: [
    'bare',
    'options'
  ],
  mounted () {
    let vm = this
    this.lmap = L.markerClusterGroup(this.options)

    EventBus.$on('mounted', function (lmap) {
      if (vm.$parent._isMounted) {
        if (lmap._leaflet_id === vm.$parent.lmap._leaflet_id) {
          if (!vm.bare) {
            vm.add(vm.$parent.lmap)
            vm.update()
          }
          EventBus.$emit('mounted', vm.lmap)
        }
      }
    })
  },
  beforeDestroy () {
    this.remove()
  },
  updated () {
    let vm = this
    if (!vm.bare) {
      vm.update()
    }
  },
  methods: {
    add (lmap) {
      let vm = this
      vm.lmap.addTo(lmap)
    },
    remove () {
      let vm = this
      let parent = vm.$parent.lmap

      vm.lmap.clearLayers()
      parent.removeLayer(vm.lmap)
    },
    clear () {
      this.lmap.clearLayers()
    },
    update (mapas) {
      let vm = this
      let markers = mapas

      vm.clear()
      if (!vm.bare) {
        for (let i = vm.$children.length; i--;) {
          for (let ii = vm.$children[i].$children.length; ii--;) {
            vm.$children[i].$children[ii].add(vm.$children[i].lmap)
          }
        }
        markers = vm.$children.map(marker => marker.lmap)
      }
      vm.lmap.addLayers(markers)
      vm.$emit('updated')
    }
  }
}
</script>
