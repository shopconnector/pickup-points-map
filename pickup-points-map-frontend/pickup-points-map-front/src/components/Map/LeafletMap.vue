<template>
<div :class="{'list-background-mobile-fix' : isMobile}">
  <div :class="isWidgetVersion ? 'map-v2' : 'map'">
    <div class="type-actions" :class="{'type-actions-v2' : !isWidgetVersion}">
      <p class="button-action" :class="{ 'active' : !toogleMap }" @click="toogleMapMethod('show')">Mapa</p>
      <p class="button-action" :class="{ 'active' : toogleMap }" @click="toogleMapMethod('hide')">Lista</p>
    </div>
    <div v-if="this.$store.state.geolocation.error.code === 1 && ($store.state.pointMarkers && !$store.state.pointMarkers.length)" class="first-enter-info">
      <p class="error-text">
        Wybierz adres/lokalizację aby
        <br>zobaczyć najbliższe punkty odbioru
        <span class="mt10">Uwaga: Lokalizacja dla tej domeny jest zablokowana. <br>Możesz ponownie włączyć w ustawieniach przeglądarki.</span>
      </p>
    </div>
    <div v-else-if="$store.state.pointMarkers && !$store.state.pointMarkers.length" class="first-enter-info">
      <p>Wybierz adres/lokalizację aby<br>zobaczyć najbliższe punkty odbioru</p>
    </div>
    <div v-else-if="$store.state.status === 'error, points couldnt be loaded'" class="first-enter-info">
      <p>Nie znaleźiono żadnego punktu. Zmień kryteria wyboru.</p>
    </div>
     <div v-else-if="($store.state.zoom < 13 || ($store.state.pointMarkers && $store.state.pointMarkers.length > 100)) && !toogleMap" class="error-info">
      <p>Powiększ zoom żeby zobaczyć punkty</p>
    </div>
    <transition name="fade">
      <div  v-if="toogleMap" class="list-box" :class="{'listbox-margin-top' : isWidgetVersion}">
          <div class="list-title hidden-xs"><h1>Punkty odbioru w pobliżu Twojej lokalizacji</h1></div>
          <div v-if="listMarkers.length === 0 && !$store.state.storeFilters.checkedSuppliers.length">
            <p class="empty-text">Wybierz adres/lokalizację aby zobaczyć najbliższe punkty odbioru</p>
          </div>
          <div class="scroll-box" :class="{'change-vh' : !isWidgetVersion}">
              <div class="list-row" :class="{'list-row-modal' : isOpenListModal(index)}"
                v-for="(listMarker, index) in listMarkers"
                :key="index"
                @click="openListModal(index)"
                v-on="isMobile ? { click: () => getPointDetails(listMarker.lat, listMarker.lon, listMarker.pickup_point_type) } : {} "
                >
                  <div class="list-elem list-elem-img">
                    <img :class="{'img-modal' : isOpenListModal(index)}" :src="logosUrl[listMarker.pickup_point_type]" width="auto" height="70px" />
                  </div>
                  <div class="list-elem list-elem-address">
                    <b>{{ listMarker.address.street }}</b>
                    <p class="address-parag">{{ listMarker.zip }}
                    {{ listMarker.address.zip }} {{ listMarker.address.city }}</p>
                  </div>
                  <div class="list-elem hours-elem">
                    <b>Godziny otwarcia:</b>
                    {{ listMarker.working_hours }}
                  </div>
                  <div class="list-elem btn-elem">
                    <p class="list-button" @click="getPointDetails(listMarker.lat, listMarker.lon, listMarker.pickup_point_type),toogleMethod('true')">Wybierz</p>
                  </div>
                  <transition name="fade">
                    <div class="list-modal" v-if="isOpenListModal(index) && isMobile && $store.state.markerDetails">
                      <template v-if="typeof $store.state.markerDetails.points !== 'undefined'">
                        <div class="list-modal-hours" v-if="$store.state.markerDetails.points[0].working_hours.length">
                          <b>Godziny otwarcia:</b>
                          <template v-for="day in $store.state.markerDetails.points[0].working_hours">
                            {{ day }}
                          </template>
                        </div>
                        <div class="list-modal-additional">
                          <p v-if="$store.state.markerDetails.points[0].features.open_late" class="icon hours"/>
                          <p v-if="$store.state.markerDetails.points[0].features.open_saturday" class="icon sobota"/>
                          <p v-if="$store.state.markerDetails.points[0].features.open_sunday" class="icon niedziela"/>
                          <p v-if="$store.state.markerDetails.points[0].features.parking" class="icon parking"/>
                          <p v-if="$store.state.markerDetails.points[0].features.disabled_friendly" class="icon niepelnosprawni"/>
                          <p v-if="$store.state.markerDetails.points[0].features.cash_on_delivery" class="icon pobraniem"/>
                        </div>
                    </template>
                      </div>
                  </transition>
              </div>
              <div v-if="$store.state.listMarkers.length !== 0" class="load-box" @click="loadMorePoints()"><p class="load-button">Załaduj więcej</p></div>
          </div>
      </div>
    </transition>
    <transition name="fade">
        <l-map
          :zoom="zoom"
          :center="center"
          :options="{zoomControl: false}"
          @update:bounds="boundsUpdated"
          @update:center="centerUpdated"
          @update:zoom="zoomUpdated"
          @popupopen="popupOpen"
          @popupclose="popupClose"
        >
            <l-tile-layer :url="url" :attribution="attribution" />
            <template>
              <l-marker
                v-for="marker in pointMarkers"
                :key="marker.id"
                :visible="true"
                :lat-lng="{ lat: marker.lat, lng: marker.lon }"
                class-name="markertype"
                @click="getPointDetails(marker.lat, marker.lon, marker.pickup_type)"
                v-on="isMobile ? { click: () => toogleMethod('true') } : {} "
              >
                <l-icon :icon-anchor="[iconsUrl[marker.pickup_type]]" :icon-size="[52, 52]" class-name="someExtraClass">
                  <img :src="pinsUrl[marker.pickup_type]" width="52" height="52"/>
                </l-icon>
                <transition name="bounce">
                  <l-popup v-if="!isMobile">
                    <div class="popup-box">
                      <img class="popup-marker" :src="pinsUrl[marker.pickup_type]" width="102" height="102"/>
                      <div class="popup-info">
                        <div class="popup-text-box">
                          <template v-if="typeof $store.state.markerDetails.points !== 'undefined'">
                            <p class="popup-text" v-if="$store.state.markerDetails.length !== 0">
                              <b>{{ $store.state.markerDetails.points[0].name }}</b><br>
                              <b>{{ $store.state.markerDetails.street }}</b><br> {{ $store.state.markerDetails.zip }} {{ $store.state.markerDetails.city }}, <br> {{ $store.state.markerDetails.points[0].id }}
                            </p>
                           </template>
                        </div>
                        <div class="popup-img" >
                          <img :src="logosUrl[marker.pickup_type]" width="100%" height="auto"/>
                        </div>
                      </div>
                      <div class="popup-action">
                        <p id="btn-wybierz" class="popup-button" @click="toogleMethod('true')">Wybierz</p>
                      </div>
                    </div>
                  </l-popup>
                </transition>
              </l-marker>
            </template>
        </l-map>
    </transition>
  </div>
    <div>
      <transition :name="isMobile ? 'fade-in-up' : 'bounce'">
        <div class="modal-position" :class="{'modal-positionV2' : !isWidgetVersion}" v-if="toogleModal">
          <ModalDiv @closed="onCloseChild"/>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LTooltip, LControlZoom, LIcon } from 'vue2-leaflet'
import { latLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ModalDiv from '../features/ModalDiv.vue'
import { MobileDetected } from '../mobileDetected.ts'
import EventBus from '../../event-bus'

export default {
  name: 'Home',
  components: {
    ModalDiv,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LControlZoom,
    LIcon
  },
  mixins: [MobileDetected],
  data () {
    return {
      isPopupOpen: false,
      selectedPoint: Number,
      toogleMap: false,
      toogleModal: false,
      url: 'https://scorch.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      closeButton: false,
      iconsUrl: {
        'Żabka': require('../../assets/logos/żabka.png'),
        'DPD Pickup': require('../../assets/logos/dpd-pickup.png'),
        'Fresh Market': require('../../assets/logos/freshmarket.png'),
        'In Post': require('../../assets/logos/inpost.png'),
        'Poczta Polska': require('../../assets/logos/pocztapolska.png'),
        'Paczka w Ruchu': require('../../assets/logos/paczka_w_ruchu.jpg'),
        'Orlen': require('../../assets/logos/orlen.png')
      },
      logosUrl: {
        'Żabka': require('../../assets/logos/żabka.png'),
        'DPD Pickup': require('../../assets/logos/dpd-pickup.png'),
        'Fresh Market': require('../../assets/logos/freshmarket.png'),
        'In Post': require('../../assets/logos/inpost.png'),
        'Poczta Polska': require('../../assets/logos/pocztapolska.png'),
        'Paczka w Ruchu': require('../../assets/logos/paczka_w_ruchu.jpg'),
        'Orlen': require('../../assets/logos/orlen.png')
      },
      pinsUrl: {
        'Żabka': require('../../assets/zabka.png'),
        'DPD Pickup': require('../../assets/dpdpickup.png'),
        'Fresh Market': require('../../assets/fresh.png'),
        'In Post': require('../../assets/inpost.png'),
        'Poczta Polska': require('../../assets/poczta-polska.png'),
        'Paczka w Ruchu': require('../../assets/paczka-w-ruchu.png'),
        'Orlen': require('../../assets/orlen.png')
      }
    }
  },
  computed: {
    // changeFiltersError () {
    //   if ((this.$store.state.pointMarkers && this.$store.state.pointMarkers.length === 0) &&
    //   ((this.$store.state.storeFilters.checkedSuppliers && this.$store.state.storeFilters.checkedSuppliers.length !== 0) ||
    //   (this.$store.state.storeFilters.features && this.$store.state.storeFilters.features.length !== 0))) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    storeFilters () {
      return this.$store.state.storeFilters
    },
    checkedLength () {
      return !this.$store.state.pointMarkers.length
    },
    zoom () {
      return this.$store.state.zoom
    },
    center () {
      return latLng(this.$store.state.lat, this.$store.state.lng)
    },
    pointMarkers () {
      if (this.$store.state.pointMarkers && this.$store.state.pointMarkers.length > 100) {
        return []
      } else {
        return this.$store.state.pointMarkers
      }
    },
    listMarkers () {
      return this.$store.state.listMarkers
    },
    isWidgetVersion () {
      return this.$store.state.customer.theme
    },
    zoomOrCenterUpdateOrFiltersUpdate () {
      return [this.$store.state.zoom, this.$store.state.lat, this.$store.state.lng, this.$store.state.storeFilters.features, this.$store.state.storeFilters.checkedSuppliers, this.$store.state.pointId].join()
    },
    pointIdUpdate () {
      return [this.$store.state.pointId].join()
    }
  },
  watch: {
    zoomOrCenterUpdateOrFiltersUpdate: {
      handler () {
        this.$store.commit('changePageNumber', 1)
        if (this.$store.state.pointId) {
          this.$store.dispatch('get_points', {
            lat: '',
            lng: '',
            dist: '',
            filtered: '',
            id: `id=${this.$store.state.pointId}`,
            key: `&key=${this.$store.state.customer.key}`
          })
          // if (this.$store.state.pointMarkers) {
          //   this.$store.commit('updatePosition', [{ lat: this.$store.state.pointMarkers[0].lat, lng: this.$store.state.pointMarkers[0].lon, zoom: 16 }])
          // }
          this.$store.dispatch('get_list_points', {
            lat: '',
            lng: '',
            page: '',
            filtered: '',
            id: `id=${this.$store.state.pointId}`,
            key: `&key=${this.$store.state.customer.key}`
          })
        } else if (this.$store.state.zoom >= 13 && !this.isPopupOpen && this.$store.state.radiusOfVisibily !== 0) {
          this.$store.dispatch('get_points', {
            lat: `lat=${this.$store.state.lat}`,
            lng: `&lon=${this.$store.state.lng}`,
            key: `&key=${this.$store.state.customer.key}`,
            dist: `&dist=${this.$store.state.radiusOfVisibily}`,
            filtered: this.filteredPoints(),
            id: ''
          })
          this.$store.dispatch('get_list_points', {
            lat: `lat=${this.$store.state.lat}`,
            lng: `&lon=${this.$store.state.lng}`,
            key: `&key=${this.$store.state.customer.key}`,
            page: `&page=${this.$store.state.pageNumber}`,
            filtered: this.filteredPoints(),
            id: ''
          })
        }
      }
    },
    pointIdUpdate: {
      handler () {
        setTimeout(() => {
          this.$store.commit('updatePosition', [{ lat: this.$store.state.pointMarkers[0].lat, lng: this.$store.state.pointMarkers[0].lon, zoom: 16 }])
        }, 100)
      }
    }
  },
  mounted () {
    EventBus.$on('popupClose', () => {
      this.popupClose()
      var closePopup = document.getElementsByClassName('leaflet-popup-close-button')[0]
      if (closePopup) {
        closePopup.click()
      }
    })
  },
  methods: {
    filteredPoints () {
      var features = []
      var pickupTypes = []
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
    popupOpen () {
      this.isPopupOpen = true
    },
    popupClose () {
      this.toogleModal = false
      this.isPopupOpen = false
      this.$store.commit('clear_point_details')
    },
    getPointDetails (lat, lng, type) {
      this.$store.dispatch('get_point_details', {
        lat: lat,
        lng: lng,
        key: this.$store.state.customer.key,
        type: type
      })
    },
    loadMorePoints () {
      var newPage = this.$store.state.pageNumber + 1
      this.$store.commit('changePageNumber', newPage)
      this.$store.dispatch('get_list_points', {
        lat: `lat=${this.$store.state.lat}`,
        lng: `&lon=${this.$store.state.lng}`,
        key: `&key=${this.$store.state.customer.key}`,
        page: `&page=${this.$store.state.pageNumber}`,
        filtered: this.filteredPoints(),
        id: ''
      })
    },
    toogleMapMethod (text) {
      if (text === 'show') {
        this.toogleMap = false
      } else if (text === 'hide') {
        this.toogleMap = true
      }
      this.toogleMethod('false')
      this.$store.commit('closeListFooter')
    },
    centerUpdated (center) {
      this.$store.commit('updatePosition', [{ lat: center.lat, lng: center.lng, zoom: null }])
    },
    zoomUpdated (zoom) {
      this.$store.commit('updatePosition', [{ lat: null, lng: null, zoom: zoom }])
    },
    boundsUpdated (bounds) {
      var fromLng = bounds._northEast.lng / 180.0 * Math.PI
      var fromLat = bounds._northEast.lat / 180.0 * Math.PI
      var pointLng = bounds._southWest.lng / 180.0 * Math.PI
      var pointLat = bounds._southWest.lat / 180.0 * Math.PI
      var dist = Math.acos(Math.sin(fromLat) * Math.sin(pointLat) + (Math.cos(fromLat) * Math.cos(pointLat) * Math.cos(pointLng - fromLng))) * 6371000
      var rad = Math.round(dist / 2)
      this.$store.commit('changeRadiusOfVisibility', rad)
    },
    toogleMethod (bool) {
      if (bool === 'true') {
        this.toogleModal = true
      } else if (bool === 'false') {
        this.toogleModal = false
      } else {
        this.toogleModal = !this.toogleModal
      }
    },
    onCloseChild () {
      this.toogleModal = false
    },
    openListModal (index) {
      this.selectedPoint = index
    },
    isOpenListModal (index) {
      if (this.selectedPoint === index) {
        this.$store.commit('openListFooter')
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.mt10 {
  margin-top: 10px;
}
.leaflet-marker-icon {
  position: absolute;
  top: -52px;
  left: -20px;
}
.leaflet-popup {
  .leaflet-popup-content-wrapper {
    border: 3px solid #3F87F5;
  }
  .leaflet-popup-tip-container {
    display: none;
  }
  a.leaflet-popup-close-button {
    right: 220px;
    top: 5px;
    color: #333333;
  }
  // padding-top: calc( 50vh - 122px );
  padding-right: 210px !important;
  // bottom: -20px !important;
  margin-left: 210px !important;
  margin-bottom: 0 !important;
 }
.leaflet-right .leaflet-control {
  margin-right: 0;
}
.leaflet-bottom .leaflet-control {
  margin-bottom: 0;
}
.leaflet-control-attribution, .leaflet-control-scale-line {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.7);
  margin: 0;
}
.leaflet-control-attribution a {
  color: #0078A8;
}
::-webkit-scrollbar-track {
  background: transparent;
}
 @media only screen and (max-width: 1100px) {
   .leaflet-touch .leaflet-bar a {
     width: 25px;
     height: 25px;
     line-height: 25px;
   }
   .leaflet-touch .leaflet-control-zoom-in,
   .leaflet-touch .leaflet-control-zoom-out {
     font-size: 19px;
   }
}
@media (max-width: 767px) {
  .leaflet-popup .leaflet-popup-content-wrapper {
    border: 1px solid #E54C69;
  }
}
</style>

<style lang="scss" scoped>
.empty-text {
  margin: 0;
  color: #E54C69;
  @media (max-width: 767px) {
    text-align: center;
  }
}
.load-box {
  display: flex;
  justify-content: center;
  .load-button {
    margin: 40px 0;
    background-color: #E4405F;
    padding: 10px 15px;
    border-radius: 50px;
    color: white;
    display: inline;
    text-align: center;
    cursor: pointer;
  }
}
.list-background-mobile-fix{
  background: #F5F5F5;
}
.list-modal{
  width: 100%;
  .list-modal-hours{
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 15px 0;
    font-size: 14px;
  }
  .list-modal-additional{
    display: flex;
    justify-content: space-evenly;
    .icon{
      width: 17px;
      height: 17px;
      display: flex;
    }
    .hours{
      background: url('../../assets/icons/ZEGAR.png') 0 0 no-repeat;
      background-size: cover;
    }
    .sobota{
      background: url('../../assets/icons/sobota.png') 0 0 no-repeat;
      background-size: cover;
    }
    .niedziela{
      background: url('../../assets/icons/niedziela.png') 0 0 no-repeat;
      background-size: cover;
    }
    .parking{
      background: url('../../assets/icons/parking.png') 0 0 no-repeat;
      background-size: cover;
    }
    .pobraniem{
      background: url('../../assets/icons/za-pobraniem.png') 0 0 no-repeat;
      background-size: cover;
      }
    .niepelnosprawni{
      background: url('../../assets/icons/niepelnosprawni.png') 0 0 no-repeat;
      background-size: cover;
    }
  }
}
.map{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  max-height: 100vh;
  position: relative;
}
.map-v2{
  position: relative;
  width: 100%;
  height: calc( 100vh - 110px );
  overflow: hidden;
  max-height: calc( 100vh - 110px );
  @media (max-width: 767px) {
    height: 100vh;
    max-height: 100vh;
  }
}
.first-enter-info {
  position: absolute;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00000054;
  @media (max-width: 767px) {
    top: 70px;
  }
  p {
    margin: 0;
    padding: 15px;
    border-radius: 5px;
    color: #e4405f;
    font-weight: 700;
    text-transform: uppercase;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    span {
      margin-top: 5px;
      font-size: 12px;
    }
  }
}
.error-info {
  position: absolute;
  z-index: 1000;
  top: 47%;
  left: 0;
  margin: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    margin: 0;
    padding: 15px;
    border-radius: 5px;
    color: #e4405f;
    font-weight: 700;
    text-transform: uppercase;
    background-color: #ffffff;
  }
}
.popup-info {
  width: 200px;
  position: relative;
  .popup-text-box {
    width: 70%;
    .popup-text {
      margin: 0;
    }
  }
  .popup-img {
    width: 30%;
  }
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
}
.popup-action {
.popup-button {
  margin: 5px 0;
  background-color: #E4405F;
  padding: 10px 20px;
  border-radius: 9px;
  text-transform: uppercase;
  color: white;
  display: inline;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
}
justify-content: center;
display: flex;
}
.popup-marker {
  position: absolute;
  left: -15px;
  top: -92px;
}
.type-actions {
  .button-action {
    &.active {
      color: white;
      background-color: #DD2C54;
    }
    color: #4A4A4A;
    background-color: #E5E5E5;
    padding: 8px 40px 10px 40px;
    margin: 0;
    cursor: pointer;
  }
  position: absolute;
  z-index: 999;
  left: 20px;
  top: 25px;
  background-color: white;
  display: flex;
  border-radius: 15px;
  overflow: hidden;
  @media (max-width: 767px) {
    position: fixed;
    right: 20px;
    left: auto;
    top: 15px;
    .button-action {
      padding: 12px 40px 12px 40px;
    }
  }
}
.type-actions-v2{
  left: auto;
  right: 20px;
  top: 20px;
  @media (max-width: 767px) {
    right: 20px;
    left: auto;
    top: 15px;
  }
}
.hours-elem{
  flex-basis: 30% !important;
  max-width: 30% !important;
}
.btn-elem{
  flex-basis: 20% !important;
  max-width: 20% !important;
}
.list-box {
  .list-title {
    h1 {
      font-weight: 700;
      font-size: 22px;
      padding: 10px 0;
      margin: 0;
    }
  }
  .list-row {
    .list-elem {
      .list-button {
        margin: 5px 0;
        background-color: #E4405F;
        padding: 5px 10px;
        border-radius: 50px;
        color: white;
        display: inline;
        text-align: center;
        cursor: pointer;
      }
      text-align: center;
      flex-basis: 25%;
      max-width: 25%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .address-parag{
        margin: 0;
      }
    }
    padding: 20px 0;
    border-bottom: 1px solid #AAAAAA;
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .scroll-box {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    height: 70vh;
    border: 1px solid #AAAAAA;
  }
  height: 100vh;
  margin-top: 80px;
  padding: 0px 20px;
  text-align: left;
}
.listbox-margin-top{
  margin-top: 70px !important;
}
.modal-position {
  width: 55%;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 999;
  transition: 0.3s all;
}
.modal-positionV2{
  left: 0;
  width: 55%;
}
.change-vh{
  min-height: 81vh !important;
}
// transitions
.fade-enter-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in .5s;
  transition: all .3s ease;
}
.bounce-leave-active {
  animation: bounce-out .5s reverse;
}
.bounce-enter {
  transition: all .3s ease;
  transform: translateY(20%);
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    right:0;
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.fade-in {
  &-down-enter-active,
  &-up-enter-active{
    transition: all .4s cubic-bezier(0.4, 0.0, 0.2, 1);
  }
  &-down-leave-active,
  &-up-leave-active {
    transition: all .4s cubic-bezier(0.4, 0.0, 1, 1);
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
// animation end
@media only screen and (max-width: 1100px) {
 .type-actions{
   .button-action{
     font-size: 14px;
   }
 }
.type-actions-v2{
   .button-action{
     font-size: 14px;
   }
 }
 .list-box{
   padding: 0 10px;
   .list-title{
     font-size: 17px;
   }
   .list-row{
     .list-elem{
       font-size: 14px;
       img{
         height: 65px;
       }
       .list-button{
         font-size: 14px;
         padding: 5px 6px;
       }
     }
   }
 }
 .popup-action{
   .popup-button{
     font-size: 11px;
     padding: 8px 15px;
   }
 }
}

@media (max-width: 767px) {
.modal-position{
    width: 100%;
    bottom: 0;
    z-index: 1001;
}
    .list-box{
      padding: 0;
      margin-top: 70px;
      background: #F5F5F5;
      .scroll-box{
        height: calc( 100vh - 160px);
        border: 0;
      }
      .list-row-modal{
        background: #FFFFFF;
      }
      .list-row{
        border-bottom: 1.5px solid #E5E5E5;
        justify-content: center;
        &:last-child{
          border-bottom: none;
          margin-bottom: 15px;
        }
          .list-elem{
            flex-basis: 50%;
            max-width: 50%;
            justify-content: normal;
            .img-modal{
               filter: none;
               height: 65px;
            }
            img{
              filter: grayscale(1) opacity(0.6);
              height: 55px;
              padding-right: 20px;
            }
          }
          .list-elem-address{
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: end;
              .address-parag{
                margin: 0;
                padding-top: 5px;
              }
          }
          .list-elem-img{
                justify-content: flex-end;
          }
          .hours-elem{
            display: none;
          }
          .btn-elem{
            display: none;
          }
      }
    }
}
</style>
