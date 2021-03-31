<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet-canvas-layer'
import EventBus from './../bus.js'
const props = ['markers', 'drawing', 'mounting', 'moving', 'unmounting']

export default {
  props: props,
  mounted () {
    let vm = this
    this.mapa = this.drawObject()

    EventBus.$on('mounted', function (mapa) {
      if (vm.$parent._isMounted) {
        if (mapa._leaflet_id === vm.$parent.mapa._leaflet_id) {
          vm.mapa.addTo(vm.$parent.mapa)
          EventBus.$emit('mounted', vm.mapa)
          EventBus.$off('mounted')
        }
      }
    })
  },
  methods: {
    draw () {
      let vm = this
      vm.mapa.needRedraw()
    },
    addLayer () {
    },
    drawObject () {
      let vm = this
      let mapObject = null
      mapObject = L.canvasLayer().delegate(vm)
      return mapObject
    },
    onDrawLayer (info) {
      let vm = this
      vm.$emit('draw', info)
      let map = vm.$parent.mapa
      let ctx = info.canvas.getContext('2d')
      let markers = vm.markers || vm.$children.map(marker => marker.mapa)

      ctx.clearRect(0, 0, info.canvas.width, info.canvas.height)
      ctx.fillStyle = 'rgba(255, 116, 0, 1)'

      for (let i = 0; i < markers.length; i++) {
        let dot = map.latLngToContainerPoint(markers[i]._latlng)
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
      }
      info.layer.fire('zoom')
      vm.$emit('drawn', info)
    }
  }
}
</script>
