<template>
  <div style="width:100%;height:100%;">
    <div class="loading" v-show="isFetching">
      <h2>Loading...</h2>
    </div>
    <v-map ref="map" :zoom="getZoom" :center="center" :options="{center: center, zoom: getZoom}">
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
      <v-markercluster ref="cluster" @updated="stopFetching" :bare="true" :options="{chunkedLoading: true, maxClusterRadius: 200}"></v-markercluster>
    </v-map>
  </div>
</template>

<script>
import Vue from 'vue'
import Mapa from '../components/newMap/src/mapa'
import { mapGetters } from 'vuex'
// random coordinates example
const Points = require('../assets/points.json')

Vue.component('v-map', Mapa.Map)
Vue.component('v-tilelayer', Mapa.Tile)
Vue.component('v-markercluster', Mapa.MarkerCluster)

export default {
  components: {
    'v-map': Mapa.Map,
    'v-tilelayer': Mapa.Tile,
    'v-marker': Mapa.Marker,
    'v-markercluster': Mapa.MarkerCluster,
    'v-popup': Mapa.Popup,
    'v-tooltip': Mapa.Tooltip,
    'v-geojson': Mapa.GeoJSON
  },
  data () {
    let points = Points
    let locations = []
    let icon = window.L.icon({iconUrl: require('../assets/inpost.png'), iconSize: [52, 52]})
    console.log(points)
    for (let i = points.length - 1; i > 0; i--) {
      let point = points[i]
      let coord = [point.lat, point.lon]
      let marker = window.L.marker(coord, {icon: icon})
      marker.bindTooltip('Hello ' + i)
      locations.push(marker)
    }
    return {
      geojson: null,
      icon: icon,
      isFetching: true,
      initialLocation: window.L.latLng(-34.9205, -57.953646),
      locations: locations,
      url: 'https://atileosmorg-luldmjs.stackpathdns.com/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  methods: {
    stopFetching () {
      console.log('cluster updated')
      this.isFetching = false
    }
  },
  computed: {
    ...mapGetters({
      getZoom: 'getZoom',
      getCurrentLat: 'getCurrentLat',
      getCurrentLng: 'getCurrentLng'
    }),
    center () {
      return window.L.latLng(this.getCurrentLat, this.getCurrentLng)
    }
  },
  mounted () {
    let vm = this
    vm.$refs.cluster.add(vm.$refs.map.mapa)
    vm.$refs.cluster.update(vm.locations)
    vm.isFetching = false
  }
}
</script>

<style lang="scss">
  html, body {
    height: 100%
  }
</style>
