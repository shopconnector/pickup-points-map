<template>
  <div style="width:100%;height:100%;">
    <v-map id="mapId" ref="map" :zoom.sync="getZoom" :center="center" :options="{center: center, zoom: getZoom, zoomControl: true }">
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
      <v-markercluster ref="cluster" @updated="stopFetching" :bare="true" :options="{chunkedLoading: true, maxClusterRadius: 200}">
        <v-popup v-if="!isMobile">
          <div class="popup-box" v-if="Object.keys($store.state.markerDetails).length !== 0">
            <div v-for="(point, index) in points" :key="'info-' + index">
              <div class="popup-info">
                <div class="popup-text-box">
                  <template v-if="point">
                    <p class="popup-text" v-if="Object.keys($store.state.markerDetails).length !== 0">
                      <b><img class="popup-icon" :src="popupIcons[$store.state.markerDetails.pickup_type]" />{{ point.name }}</b><br />
                      <b>{{ $store.state.markerDetails.street }}</b><br />
                      {{ $store.state.markerDetails.zip }} {{ $store.state.markerDetails.city }}, <br />
                      {{ point.id }}
                    </p>
                  </template>
                </div>
                <div class="popup-img">
                  <img :src="getImgUrl(logosUrl[$store.state.markerDetails.pickup_type])" width="100%" height="auto" />
                </div>
                <template v-if="point && Object.keys($store.state.markerDetails).length !== 0">
                  <div class="popup-add">
                    <p class="popup-time" v-if="point && point.working_hours && point.working_hours.length > 0">
                      Godziny otwarcia: <br />
                      {{ point.working_hours.join(' ') }}
                    </p>
                    <div class="popup-features">
                      <p class="features-item" v-if="point.features.open_late">Otwarte do pózna</p>
                      <p class="features-item" v-if="point.features.open_saturday">Otwarte w soboty</p>
                      <p class="features-item" v-if="point.features.open_sunday">Otwarte w niedziele</p>
                      <p class="features-item" v-if="point.features.parking">Parking</p>
                      <p class="features-item" v-if="point.features.disabled_friendly">Ułatwienie dla osób niepełnosprawnych</p>
                      <p class="features-item" v-if="point.features.cash_on_delivery">Odbiór za pobraniem</p>
                    </div>
                  </div>
                </template>
              </div>
              <div class="popup-action" :key="'btn-' + index">
                <div class="road">
                  <a :href="linkToRoad" target="_blank">Wyznacz trasę dojazdu</a>
                </div>
                <p id="btn-wybierz" class="popup-button" :style="getBackgroundColor" @click="setPoint($store.state.markerDetails, point)">
                  Wybierz i wróć do zamówienia
                </p>
              </div>
            </div>
          </div>
        </v-popup>
      </v-markercluster>
    </v-map>
    <div>
      <transition :name="'fade-in-up'">
        <div class="modal-position" :class="{ 'modal-positionV2': !isWidgetVersion }" v-if="$store.state.toogleModal">
          <ModalDiv @closed="onCloseChild" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import LMap from '../newMap/src/map'
import { mapGetters } from 'vuex'
import ModalDiv from '../features/ModalDiv.vue'
import { MobileDetected } from '../mobileDetected.ts'
import EventBus from '../../event-bus'

Vue.component('v-map', LMap.Map)
Vue.component('v-tilelayer', LMap.Tile)
Vue.component('v-markercluster', LMap.MarkerCluster)
Vue.component('v-popup', LMap.Popup)

export default {
  components: {
    ModalDiv,
    'v-map': LMap.Map,
    'v-tilelayer': LMap.Tile,
    'v-marker': LMap.Marker,
    'v-markercluster': LMap.MarkerCluster,
    'v-popup': LMap.Popup
  },
  mixins: [MobileDetected],
  data () {
    return {
      geojson: null,
      icon: null,
      isFetching: true,
      dataToSend: {
        pickup_type: '',
        points: {},
        street: '',
        city: '',
        zip: ''
      },
      initialLocation: window.L.latLng(-34.9205, -57.953646),
      locations: [],
      url: 'https://tiles.pickuppoints.pl/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      popupIcons: {
        'DPD Pickup': require('../../assets/popup-icons/dpd16x16.png'),
        'In Post': require('../../assets/popup-icons/paczkomaty-16x16.png'),
        'Poczta Polska': require('../../assets/popup-icons/poczta-16x16.png'),
        'Paczka w RUCHu': require('../../assets/popup-icons/ruch16x16.png')
      },
      logosUrl: {
        'Żabka': 'żabka.png',
        'DPD Pickup': 'dpd-pickup.png',
        'Fresh Market': 'freshmarket.png',
        'In Post': 'inpost.png',
        'Poczta Polska': 'pocztapolska.png',
        'Paczka w RUCHu': 'paczka_w_ruchu.jpg',
        'Orlen': 'orlen.png',
        'Inne': 'inne.png',
        'Biedronka': 'biedronka.png',
        'Carrefour': 'carrefour.png',
        'AUTOMAT SPOLEM': 'spolem.png',
        'AUTOMAT BIEDRONKA': 'biedronka.png',
        'AUTOMAT CARREFOUR': 'carrefour.png',
        'AUTOMAT LEWIATAN': 'lewiatan.png',
        'BIEDRONKA': 'biedronka.png',
        'LEWIATAN': 'lewiatan.png',
        'ABC': 'abc.jpeg',
        'DELIKATESY CENTRUM': 'delikatesy.png',
        'KAUFLAND': 'kaufland.png'
      },
      pinsUrl: {
        'Żabka': 'zabka.png',
        'DPD Pickup': 'dpdpickup.png',
        'Fresh Market': 'fresh.png',
        'In Post': 'inpost.png',
        'Poczta Polska': 'poczta-polska.png',
        'Paczka w RUCHu': 'paczka-w-ruchu.png',
        'Orlen': 'orlen.png',
        'Inne': 'inne.png',
        'Biedronka': 'biedronka.png',
        'Carrefour': 'carrefour.png',
        'AUTOMAT SPOLEM': 'spolem.png',
        'AUTOMAT BIEDRONKA': 'biedronka.png',
        'AUTOMAT CARREFOUR': 'carrefour.png',
        'AUTOMAT LEWIATAN': 'lewiatan.png',
        'BIEDRONKA': 'biedronka.png',
        'LEWIATAN': 'lewiatan.png',
        'ABC': 'abc.jpeg',
        'DELIKATESY CENTRUM': 'delikatesy.png',
        'KAUFLAND': 'kaufland.png'
      }
    }
  },
  watch: {
    zoomOrCenterUpdate: {
      handler () {
        this.updateMap()
      }
    },
    filtersUpdate: {
      handler () {
        this.uploadsMapPoints()
      }
    }
  },
  methods: {
    uploadsMapPoints () {
      this.apiCalls().then((data) => {
        let points = data.data.response.pickupPoints
        this.locations = []
        for (let i = 0; i < points.length; i++) {
          let point = points[i]
          let coord = [point.lat, point.lon]
          let icon = window.L.icon({iconUrl: this.getPinsUrl(this.pinsUrl[point.pickup_type]), iconSize: [52, 52]})
          let marker = window.L.marker(coord, {icon: icon, title: point.pickup_type, lat: point.lat, lon: point.lon}).on('click', this.onClick)
          // .bindPopup('My Popup HTML')
          this.locations.push(marker)
        }
        // let myIcon = window.L.icon({ iconUrl: require('../../assets/icons/gps24px.svg'), iconSize: [52, 52] })
        // let myMarker = window.L.marker([this.$store.state.geolocation.lat, this.$store.state.geolocation.lng], {icon: myIcon})
        // this.$refs.map.lmap.push(myMarker)

        let cluster = this.$refs.cluster
        cluster.add(this.$refs.map.lmap)
        cluster.update(this.locations)
        this.isFetching = false
      })
    },
    updateMap () {
      this.$refs.map.lmap.setView(this.center, this.getZoom)
    },
    async apiCalls () {
      let points = await this.$store.dispatch('get_points', {
        lat: `lat=${this.getCurrentLat}`,
        lng: `&lon=${this.getCurrentLng}`,
        key: `&key=${this.$store.state.customer.key}`,
        dist: `&dist=${this.$store.state.radiusOfVisibily}`,
        filtered: this.filteredPoints(),
        id: ''
      })
      return points
    },
    filteredPoints () {
      let features = []
      let pickupTypes = []
      if (this.$store.state.storeFilters.features) {
        if (this.$store.state.storeFilters.features.length > 0) {
          features = this.$store.state.storeFilters.features.map(x => {
            return `&features[]=${x}`
          })
        }
      }
      if (this.$store.state.storeFilters.checkedSuppliers) {
        if (this.$store.state.storeFilters.checkedSuppliers.length > 0) {
          pickupTypes = this.$store.state.storeFilters.checkedSuppliers.map(x => {
            return `&pickup_types[]=${x}`
          })
        }
      }
      var temp = features.concat(pickupTypes)
      return temp.join('')
    },
    onCloseChild () {
      this.$store.state.toogleModal = false
    },
    toogleMethod (bool, num) {
      this.$store.commit('changeSelectedPoint', num)
      if (bool === 'true') {
        this.$store.state.toogleModal = true
      } else if (bool === 'false') {
        this.$store.state.toogleModal = false
      } else {
        this.$store.state.toogleModal = !this.$store.state.toogleModal
      }
    },
    onClick (e) {
      let lat = e.target.options.lat
      let lng = e.target.options.lon
      let type = e.target.options.title
      this.getPointDetails(lat, lng, type)
      if (this.isMobile) this.toogleMethod('true')
    },
    stopFetching () {
      this.isFetching = false
    },
    centerUpdated (center) {
      if (center.lat !== this.getCurrentLat && center.lng !== this.getCurrentLng) this.$store.commit('updatePosition', [{ lat: center.lat, lng: center.lng, zoom: null }])
    },
    getPointDetails (lat, lng, type) {
      this.$store.dispatch('get_point_details', {
        lat: `lat=${lat}`,
        lng: `&lon=${lng}`,
        key: `&key=${this.$store.state.customer.key}`,
        type: `&pickup_type=${type}`,
        id: ''
      })
    },
    getImgUrl (pic) {
      if (pic) {
        return require('../../assets/logos/' + pic)
      } else {
        return require('../../assets/logos/404.png')
      }
    },
    getPinsUrl (pic) {
      if (pic) {
        return require('../../assets/' + pic)
      } else {
        return require('../../assets/404.png')
      }
    },
    setPoint (point, selectedPoint) {
      this.dataToSend.pickup_type = point.pickup_type
      this.dataToSend.street = point.street
      this.dataToSend.city = point.city
      this.dataToSend.zip = point.zip
      this.dataToSend.points = selectedPoint
      this.sendMessage(this.dataToSend)
    },
    sendMessage (point) {
      window.parent.postMessage(point, '*')
    }
  },
  computed: {
    ...mapGetters({
      getZoom: 'getZoom',
      getCurrentLat: 'getCurrentLat',
      getCurrentLng: 'getCurrentLng'
    }),
    zoomOrCenterUpdate () {
      return [
        // this.$store.state.zoom,
        this.$store.state.lat,
        this.$store.state.lng,
        this.$store.state.storeFilters.features,
        this.$store.state.storeFilters.checkedSuppliers
      ].join()
    },
    center () {
      return window.L.latLng(this.getCurrentLat, this.getCurrentLng)
    },
    pointMarkers () {
      return this.$store.state.pointMarkers
    },
    points () {
      if (this.$store.state.markerDetails && this.$store.state.markerDetails.points) {
        return this.$store.state.markerDetails.points
      } else {
        return 1
      }
    },
    linkToRoad () {
      if (this.$store.state.geolocation.lat && this.$store.state.suggestionTextLocit.length === 0 && this.$store.state.linkToRoad.x === 0) {
        let url =
          'https://www.google.pl/maps/dir/' +
          this.$store.state.geolocation.lat +
          ',' +
          this.$store.state.geolocation.lng +
          '/' +
          this.$store.state.markerDetails.lat +
          ',' +
          this.$store.state.markerDetails.lon +
          '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'
        return url
      } else if (this.$store.state.linkToRoad.x > 0 && this.$store.state.suggestionTextLocit.length === 0) {
        let url =
          'https://www.google.pl/maps/dir/' +
          this.$store.state.linkToRoad.x +
          ',' +
          this.$store.state.linkToRoad.y +
          '/' +
          this.$store.state.markerDetails.lat +
          ',' +
          this.$store.state.markerDetails.lon +
          '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'
        return url
      } else {
        let url =
          'https://www.google.pl/maps/dir/' +
          this.$store.state.suggestionTextLocit.city +
          ',' +
          this.$store.state.suggestionTextLocit.street +
          ',' +
          this.$store.state.suggestionTextLocit.building +
          '/' +
          this.$store.state.markerDetails.lat +
          ',' +
          this.$store.state.markerDetails.lon +
          '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'
        return url
      }
    },
    filtersUpdate () {
      return [
        this.$store.state.storeFilters.features,
        this.$store.state.storeFilters.checkedSuppliers
      ].join()
    },
    getBackgroundColor () {
      if (this.$store.state.customer.options) {
        return 'background:' + this.$store.state.customer.options.primary_color
      }
    },
    isWidgetVersion () {
      return this.$store.state.customer.theme
    }
  },
  beforeCreate () {
    EventBus.$on('toogleMethodBus', bool => {
      if (bool === 'true') {
        this.$store.state.toogleModal = true
      } else if (bool === 'false') {
        this.$store.state.toogleModal = false
      } else {
        this.$store.state.toogleModal = !this.$store.state.toogleModal
      }
    })
  },
  mounted () {
    this.uploadsMapPoints()
  }
}
</script>

<style lang="scss">
  html, body {
    height: 100%
  }
.leaflet-popup-content {
  width: 350px !important;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-right: 10px;
}
.leaflet-popup-content>div {
  padding-right: 10px;
}
.leaflet-top {
  z-index: 999;
}
.leaflet-touch .leaflet-bar a {
  width: 35px;
  height: 35px;
  line-height: 36px;
}
.leaflet-touch .leaflet-control-zoom-in,
.leaflet-touch .leaflet-control-zoom-out {
  font-size: 18px;
  box-shadow: 5px 6px 9px 4px rgba(0, 0, 0, 0.4);
}
.mt10 {
  margin-top: 10px;
}
.leaflet-marker-icon {
  position: absolute;
  top: -52px;
  left: -26px;
  margin-top: 0 !important;
  margin-left: 0 !important;
}
.leaflet-popup {
  .leaflet-popup-content-wrapper {
    box-shadow: 5px 6px 9px 4px rgba(0, 0, 0, 0.4);
  }
  .leaflet-popup-tip-container {
    display: none;
  }
  a.leaflet-popup-close-button {
    right: 220px;
    top: 5px;
    color: #333333;
    @media (max-width: 767px) {
      display: none;
    }
  }
  padding-right: 210px !important;
  margin-left: 115px !important;
  margin-bottom: 55px !important;
}
.leaflet-right .leaflet-control {
  margin-right: 0;
}
.leaflet-bottom .leaflet-control {
  margin-bottom: 0;
}
.leaflet-control-attribution,
.leaflet-control-scale-line {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.7);
  margin: 0;
}
.leaflet-control-attribution a {
  color: #0078a8;
}
::-webkit-scrollbar-track {
  background: transparent;
}
@media (max-width: 767px) {
  .leaflet-popup .leaflet-popup-content-wrapper {
    display: none;
  }
}
@media (max-width: 767px) {
  .leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {
    margin-top: 70px !important;
  }
}
</style>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.popup-info {
  min-width: 350px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .popup-text-box {
    width: 70%;
    .popup-text {
      margin: 0;
      .popup-icon {
        margin-right: 5px;
      }
    }
  }
  .popup-img {
    width: 30%;
  }
  .popup-add {
    display: flex;
    width: 100%;
    margin: 0;
    .popup-time {
      margin: 0;
      width: 50%;
    }
    .popup-features {
      margin: 0;
      padding-left: 5%;
      width: 45%;
      .features-item {
        margin: 0 0 10px 0;
      }
    }
  }
}
.popup-action {
  .popup-button {
    margin: 7px 0;
    background-color: $main-color; // over
    padding: 6px 8px;
    border-radius: 9px;
    text-transform: uppercase;
    color: $white;
    display: inline;
    text-align: center;
    font-weight: 700;
    font-size: 11px;
    cursor: pointer;
    @media (max-width: 1100px) {
      font-size: 11px;
    }
  }
  justify-content: space-between;
  align-items: center;
  display: flex;
}

// transitions
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade-in {
  &-down-enter-active,
  &-up-enter-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  &-down-leave-active,
  &-up-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 1, 1);
  }
  &-down-enter,
  &-down-leave-to,
  &-up-enter,
  &-up-leave-to {
    opacity: 0;
  }
  &-down-enter,
  &-down-leave-to {
    transform: translateY(-100%);
  }
  &-up-enter,
  &-up-leave-to {
    transform: translateY(100%);
  }
}
// mobile modal
.modal-position {
  width: 55%;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 999;
  transition: 0.3s all;
}
.modal-positionV2 {
  left: 0;
  width: 55%;
}

@media (max-width: 767px) {
  .modal-position {
    width: 100%;
    bottom: 0;
    z-index: 1001;
  }
  .list-box {
    padding: 0;
    margin-top: 70px;
    background: #f5f5f5;
    .scroll-box {
      height: calc(100vh - 160px);
      border: 0;
    }
    .list-row-modal {
      background: $white;
    }
    .list-row {
      border-bottom: 1.5px solid $light-grey;
      &:last-child {
        border-bottom: none;
        margin-bottom: 15px;
      }
      .list-elem {
        flex-basis: 50%;
        max-width: 50%;
        justify-content: normal;
        .img-modal {
          filter: none;
          height: 65px;
        }
        img {
          filter: grayscale(1) opacity(0.6);
          height: 55px;
          padding-right: 20px;
        }
      }
      .list-elem-address {
        width: 60%;
        flex-basis: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
        .address-parag {
          margin: 0;
          padding-top: 5px;
          text-align: left;
        }
      }
      .list-elem-img {
        justify-content: flex-end;
        width: 40%;
        flex-basis: 40%;
      }
      .hours-elem {
        display: none;
      }
      .btn-elem {
        display: none;
      }
    }
  }
}
</style>
