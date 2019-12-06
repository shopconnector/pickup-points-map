<template>
  <div :class="{ 'list-background-mobile-fix': isMobile }">
    <div :class="isWidgetVersion ? 'map-v2' : 'map'">
      <div class="type-actions" :class="{'box-shadow' : !isMobile }">
        <p class="button-action" :class="{ 'active': !toogleMap }" :style="{ backgroundColor: !toogleMap ? getActive : '' }" @click="toogleMapMethod('show'), openListModal(9999)">Mapa</p>
        <p
          class="button-action"
          :class="{ 'active': toogleMap }"
          :style="{ backgroundColor: toogleMap ? getActive : '' }"
          v-on="$store.state.pointMarkers && $store.state.pointMarkers.length > 100 ? {} : { click: () => toogleMapMethod('hide') }"
        >
          Lista
        </p>
      </div>
      <div class="closeWidget">
        <p class="closeBtn" @click="closeWidget()"></p>
      </div>
      <div v-if="this.$store.state.geolocation.error.code === 1 && $store.state.pointMarkers && !$store.state.pointMarkers.length" class="first-enter-info">
        <p class="error-text" :style="getColor">
          Wybierz adres/lokalizację aby
          <br />zobaczyć najbliższe punkty odbioru
          <span class="mt10">Uwaga: Lokalizacja dla tej domeny jest zablokowana. <br />Możesz ponownie włączyć w ustawieniach przeglądarki.</span>
        </p>
      </div>
      <!-- <div v-else-if="$store.state.pointMarkers && !$store.state.pointMarkers.length && $store.state.radiusOfVisibily === 1" class="first-enter-info">
        <p :style="getColor">Wybierz adres/lokalizację aby<br />zobaczyć najbliższe punkty odbioru</p>
      </div> -->
      <div
        v-else-if="$store.state.status === 'error, points couldnt be loaded' || $store.state.status === 'error, list points couldnt be loaded'"
        class="first-enter-info"
      >
        <p :style="getColor">Nie znaleziono żadnego punktu. Zmień kryteria wyboru.</p>
      </div>
      <div v-else-if="$store.state.pointMarkers && $store.state.pointMarkers.length > 100 && !toogleMap" class="error-info">
        <p :style="getColor">Powiększ zoom żeby zobaczyć punkty</p>
      </div>
      <div v-else-if="$store.state.closestPunktErrors.length > 0 && $store.state.pointMarkers.length === 10 && !toogleMap" class="error-info">
        <p class="closest-error" :style="getColor">ODDAL MAPĘ, ŻEBY POKAZAĆ PUNKTY ODBIORU.</p>
      </div>
      <transition name="fade">
        <div v-if="toogleMap" class="list-box" :class="{ 'listbox-margin-top': isWidgetVersion }">
          <div class="list-title hidden-xs"><h1>Punkty odbioru w pobliżu Twojej lokalizacji</h1></div>
          <div v-if="listMarkers.length === 0 && $store.state.storeFilters.checkedSuppliers && !$store.state.storeFilters.checkedSuppliers.length">
            <p class="empty-text">Wybierz adres/lokalizację aby zobaczyć najbliższe punkty odbioru</p>
          </div>
          <div class="scroll-box" :class="{ 'change-vh': !isWidgetVersion }">
            <div
              class="list-row"
              :class="{ 'list-row-modal': isOpenListModal(index) }"
              v-for="(listMarker, index) in listMarkers"
              :key="index"
              @click="openListModal(index)"
              v-on="isMobile ? { click: () => getPointMobileListDetails(listMarker.lat, listMarker.lon, listMarker.pickup_point_type, listMarker.id) } : {}"
            >
              <div class="list-elem list-elem-img">
                <img :class="{ 'img-modal': isOpenListModal(index) }" :src="logosUrl[listMarker.pickup_point_type]" width="auto" height="70px" />
              </div>
              <div class="list-elem list-elem-address">
                <b>{{ listMarker.id }}</b>
                <p class="address-parag">{{ listMarker.address.street }}, {{ listMarker.address.zip }} {{ listMarker.address.city }}</p>
              </div>
              <div class="list-elem hours-elem">
                <b>Godziny otwarcia:</b>
                {{ listMarker.working_hours.join(', ') }}
              </div>
              <div class="list-elem btn-elem">
                <p class="list-button" :style="getBackgroundColor" @click="getPointListDetails(listMarker.lat, listMarker.lon, listMarker.pickup_point_type, listMarker.id)">Wybierz {{ listMarker.pickup_point_type }} i zamknij</p>
                <a class="list-link" :style="getDecorationColor" :href="linkToRoadMap(listMarker)" target="_blank">Wyznacz trasę dojazdu</a>
              </div>
              <transition name="fade">
                <div class="list-modal" v-if="isOpenListModal(index) && isMobile && $store.state.markerDetails">
                  <template v-if="typeof $store.state.markerDetails.points !== 'undefined'">
                    <div class="list-modal-hours" v-if="$store.state.markerDetails.points[0].working_hours.length > 0">
                      <b>Godziny otwarcia:</b>
                      <div>
                        <template v-for="(day, index) in $store.state.markerDetails.points[0].working_hours">
                          <p class="day-mobile" :key="index">{{ day }}</p>
                        </template>
                      </div>
                    </div>
                    <div class="list-modal-additional">
                      <p v-if="$store.state.markerDetails.points[0].features.open_late" class="icon hours" />
                      <p v-if="$store.state.markerDetails.points[0].features.open_saturday" class="icon sobota" />
                      <p v-if="$store.state.markerDetails.points[0].features.open_sunday" class="icon niedziela" />
                      <p v-if="$store.state.markerDetails.points[0].features.parking" class="icon parking" />
                      <p v-if="$store.state.markerDetails.points[0].features.disabled_friendly" class="icon niepelnosprawni" />
                      <p v-if="$store.state.markerDetails.points[0].features.cash_on_delivery" class="icon pobraniem" />
                    </div>
                  </template>
                </div>
              </transition>
            </div>
            <div v-if="$store.state.listMarkers.length !== 0" class="load-box" @click="loadMorePoints()"><p class="load-button" :style="getBackgroundColor">Załaduj więcej</p></div>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <l-map
          :zoom="zoom"
          :center="center"
          :options="{ zoomControl: true}"
          @update:bounds="boundsUpdated"
          @update:center="centerUpdated"
          @update:zoom="zoomUpdated"
          @popupopen="popupOpen"
          @popupclose="popupClose"
        >
          <l-tile-layer :url="url" :attribution="attribution" />
          <template>
          <div v-if="isMobile" class="locationIconMapBox" @click="currentPos()">
            <img src="../../assets/icons/gps24px.svg" alt="Select my localization" class="locationIconMap"/>
          </div>
            <l-marker
              v-for="marker in pointMarkers"
              :key="marker.id"
              :visible="true"
              :lat-lng="{ lat: marker.lat, lng: marker.lon }"
              class-name="markertype"
              @click="getPointDetails(marker.lat, marker.lon, marker.pickup_type)"
              v-on="isMobile ? { click: () => toogleMethod('true') } : {}"
            >
              <l-icon :icon-anchor="[logosUrl[marker.pickup_type]]" :icon-size="[52, 52]" class-name="someExtraClass">
                <img :src="pinsUrl[marker.pickup_type]" width="52" height="52" />
              </l-icon>
              <transition name="bounce">
                <l-popup v-if="!isMobile && $store.state.markerDetails">
                  <div class="popup-box">
                    <template v-for="(point, index) in points">
                      <div class="popup-info" :key="'info-' + index">
                        <div class="popup-text-box">
                          <template v-if="typeof point !== 'undefined'">
                            <p class="popup-text" v-if="$store.state.markerDetails.length !== 0">
                              <b><img class="popup-icon" :src="popupIcons[marker.pickup_type]" />{{ point.name }}</b
                              ><br />
                              <b>{{ $store.state.markerDetails.street }}</b
                              ><br />
                              {{ $store.state.markerDetails.zip }} {{ $store.state.markerDetails.city }}, <br />
                              {{ point.id }}
                            </p>
                          </template>
                        </div>
                        <div class="popup-img">
                          <img :src="logosUrl[marker.pickup_type]" width="100%" height="auto" />
                        </div>
                        <template v-if="typeof point !== 'undefined' && $store.state.markerDetails.length !== 0">
                          <div class="popup-add">
                            <p class="popup-time" v-if="point && point.working_hours.length > 0">
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
                          Wybierz {{ $store.state.markerDetails.pickup_type }} i zamknij
                        </p>
                      </div>
                    </template>
                  </div>
                </l-popup>
              </transition>
            </l-marker>
            <l-marker
              v-if="$store.state.geolocation.lat"
              :lat-lng="{ lat: $store.state.geolocation.lat, lng: $store.state.geolocation.lng }"
              :visible="true"
              class-name="markertype"
            >
              <l-icon :icon-anchor="[ $store.state.geolocation.lat, $store.state.geolocation.lng]" :icon-size="[52, 52]" class-name="someExtraClass">
                <span  class="myLocationSpan" :style="getBackgroundColor"><img src="../../assets/icons/gps24px.svg" class="myLocationIcon" /></span>
              </l-icon>
            </l-marker>
          </template>
        </l-map>
      </transition>
    </div>
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
      dataToSend: {
        pickup_type: '',
        points: {},
        street: '',
        city: '',
        zip: ''
      },
      isPopupOpen: false,
      selectedPoint: Number,
      toogleMap: false,
      url: 'https://scorch.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      closeButton: false,
      popupIcons: {
        'DPD Pickup': require('../../assets/popup-icons/dpd16x16.png'),
        'In Post': require('../../assets/popup-icons/paczkomaty-16x16.png'),
        'Poczta Polska': require('../../assets/popup-icons/poczta-16x16.png'),
        'Paczka w RUCHu': require('../../assets/popup-icons/ruch16x16.png')
      },
      logosUrl: {
        Żabka: require('../../assets/logos/żabka.png'),
        'DPD Pickup': require('../../assets/logos/dpd-pickup.png'),
        'Fresh Market': require('../../assets/logos/freshmarket.png'),
        'In Post': require('../../assets/logos/inpost.png'),
        'Poczta Polska': require('../../assets/logos/pocztapolska.png'),
        'Paczka w RUCHu': require('../../assets/logos/paczka_w_ruchu.jpg'),
        Orlen: require('../../assets/logos/orlen.png')
      },
      pinsUrl: {
        Żabka: require('../../assets/zabka.png'),
        'DPD Pickup': require('../../assets/dpdpickup.png'),
        'Fresh Market': require('../../assets/fresh.png'),
        'In Post': require('../../assets/inpost.png'),
        'Poczta Polska': require('../../assets/poczta-polska.png'),
        'Paczka w RUCHu': require('../../assets/paczka-w-ruchu.png'),
        Orlen: require('../../assets/orlen.png')
      }
    }
  },
  computed: {
    getDecorationColor () {
      if (this.$store.state.customer.options) {
        return 'text-decoration-color:' + this.$store.state.customer.options.primary_color
      }
    },
    getBorderColor () {
      if (this.$store.state.customer.options) {
        return 'background-color:' + this.$store.state.customer.options.primary_color
      }
    },
    getColor () {
      if (this.$store.state.customer.options) {
        return 'color:' + this.$store.state.customer.options.primary_color
      }
    },
    getActive () {
      if (this.$store.state.customer.options) {
        return this.$store.state.customer.options.primary_color
      }
    },
    getBackgroundColor () {
      if (this.$store.state.customer.options) {
        return 'background:' + this.$store.state.customer.options.primary_color
      }
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
      return [
        this.$store.state.zoom,
        this.$store.state.lat,
        this.$store.state.lng,
        this.$store.state.storeFilters.features,
        this.$store.state.storeFilters.checkedSuppliers,
        this.$store.state.pointId,
        this.isPopupOpen
      ].join()
    },
    filtersUpdate () {
      return [this.$store.state.storeFilters.features, this.$store.state.storeFilters.checkedSuppliers].join()
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
        } else if (!this.isPopupOpen && this.$store.state.radiusOfVisibily !== 1) {
          this.$store.dispatch('get_points', {
            lat: `lat=${this.$store.state.lat}`,
            lng: `&lon=${this.$store.state.lng}`,
            key: `&key=${this.$store.state.customer.key}`,
            dist: `&dist=${this.$store.state.radiusOfVisibily}`,
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
    },
    filtersUpdate: {
      handler () {
        if (this.$store.state.pointId) {
          this.$store.dispatch('get_list_points', {
            lat: '',
            lng: '',
            page: '',
            filtered: '',
            id: `id=${this.$store.state.pointId}`,
            key: `&key=${this.$store.state.customer.key}`
          })
        } else {
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
  methods: {
    linkToRoadMap (listMarker) {
      if (this.$store.state.geolocation.lat && this.$store.state.suggestionTextLocit.length === 0 && this.$store.state.linkToRoad.x === 0) {
        let url =
          'https://www.google.pl/maps/dir/' +
          this.$store.state.geolocation.lat +
          ',' +
          this.$store.state.geolocation.lng +
          '/' +
          listMarker.lat +
          ',' +
          listMarker.lon +
          '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'
        return url
      } else if (this.$store.state.linkToRoad.x > 0 && this.$store.state.suggestionTextLocit.length === 0) {
        let url =
          'https://www.google.pl/maps/dir/' +
          this.$store.state.linkToRoad.x +
          ',' +
          this.$store.state.linkToRoad.y +
          '/' +
          listMarker.lat +
          ',' +
          listMarker.lon +
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
          listMarker.lat +
          ',' +
          listMarker.lon +
          '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'
        return url
      }
    },
    closeWidget () {
      this.sendMessage({})
    },
    setListPoint () {
      let listData = this.$store.state.markerDetails
      this.dataToSend.pickup_type = listData.pickup_type
      this.dataToSend.street = listData.street
      this.dataToSend.city = listData.city
      this.dataToSend.zip = listData.zip
      this.dataToSend.points = listData.points[0]
      this.sendMessage(this.dataToSend)
    },
    setPoint (points, selectedPoint) {
      this.dataToSend.pickup_type = points.pickup_type
      this.dataToSend.street = points.street
      this.dataToSend.city = points.city
      this.dataToSend.zip = points.zip
      this.dataToSend.points = selectedPoint
      this.sendMessage(this.dataToSend)
    },
    sendMessage (point) {
      window.parent.postMessage(point, '*')
    },
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
      this.$store.state.toogleModal = false
      this.isPopupOpen = false
      this.$store.commit('clear_point_details')
    },
    getPointDetails (lat, lng, type) {
      this.centerUpdated({lat, lng}, 7)
      this.$store.dispatch('get_point_details', {
        lat: `lat=${lat}`,
        lng: `&lon=${lng}`,
        key: `&key=${this.$store.state.customer.key}`,
        type: `&pickup_type=${type}`,
        id: ''
      })
    },
    getPointMobileListDetails (lat, lng, type, id) {
      this.centerUpdated({lat, lng}, 7)
      this.$store.dispatch('get_point_details', {
        lat: `lat=${lat}`,
        lng: `&lon=${lng}`,
        key: `&key=${this.$store.state.customer.key}`,
        type: `&pickup_type=${type}`,
        id: `&id=${id}`
      })
    },
    getPointListDetails (lat, lng, type, id) {
      this.centerUpdated({lat, lng}, 7)
      this.$store.dispatch('get_point_details', {
        lat: `lat=${lat}`,
        lng: `&lon=${lng}`,
        key: `&key=${this.$store.state.customer.key}`,
        type: `&pickup_type=${type}`,
        id: `&id=${id}`
      }).then(() => {
        this.setListPoint()
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
      this.$store.commit('closeFooterModal')
      if (text === 'show') {
        this.toogleMap = false
      } else if (text === 'hide') {
        this.toogleMap = true
      }
      if (this.$store.state.pointId) {
        this.$store.dispatch('get_list_points', {
          lat: '',
          lng: '',
          page: '',
          filtered: '',
          id: `id=${this.$store.state.pointId}`,
          key: `&key=${this.$store.state.customer.key}`
        })
      } else {
        this.$store.dispatch('get_list_points', {
          lat: `lat=${this.$store.state.lat}`,
          lng: `&lon=${this.$store.state.lng}`,
          key: `&key=${this.$store.state.customer.key}`,
          page: `&page=${this.$store.state.pageNumber}`,
          filtered: this.filteredPoints(),
          id: ''
        })
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
      var fromLng = (bounds._northEast.lng / 180.0) * Math.PI
      var fromLat = (bounds._northEast.lat / 180.0) * Math.PI
      var pointLng = (bounds._southWest.lng / 180.0) * Math.PI
      var pointLat = (bounds._southWest.lat / 180.0) * Math.PI
      var dist = Math.acos(Math.sin(fromLat) * Math.sin(pointLat) + Math.cos(fromLat) * Math.cos(pointLat) * Math.cos(pointLng - fromLng)) * 6371000
      var rad = Math.round(dist / 2)
      this.$store.commit('changeRadiusOfVisibility', rad)
    },
    // zoomClosest () {
    //   let pins = this.$store.state.pointMarkers
    //   var dist = Math.max.apply(Math, pins.map((pin) => {
    //     var fromLng = this.$store.state.lng / 180.0 * Math.PI
    //     var fromLat = this.$store.state.lat / 180.0 * Math.PI
    //     var pointLng = pin.lon / 180.0 * Math.PI
    //     var pointLat = pin.lat / 180.0 * Math.PI
    //     var dist = Math.acos(Math.sin(fromLat) * Math.sin(pointLat) + (Math.cos(fromLat) * Math.cos(pointLat) * Math.cos(pointLng - fromLng))) * 6371000
    //     return dist
    //   }))
    //   var x = Math.pow(dist, 2)
    //   var C = 2 * Math.PI * 6378137.000
    //   var temp = Math.abs((C * Math.cos(53.06616)) / x)
    //   var zoom = Math.round(Math.log2(temp) + 10)
    //   this.$store.commit('changeZoomClosest', zoom)
    //   setTimeout(() => {
    //     this.$store.commit('changeZoomClosest', zoom)
    //   }, 100)
    //   console.log('hello', zoom)
    // },
    currentPos () {
      this.$vuexGeolocation.getCurrentPosition()
      this.$store.commit('updateLocitAddress', '')
      this.$store.commit('updateLinkToRoad', {x: 0, y: 0})
      if (this.IsFooterModalOpen) {
        this.closeFooterModal()
      }
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
    onCloseChild () {
      this.$store.state.toogleModal = false
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
  left: -20px;
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
  .leaflet-touch .leaflet-bar {
    margin-top: 70px;
  }
}
</style>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.locationIconMapBox {
  position: absolute;
  z-index: 999;
  left: 8px;
  top: 160px;
  height: 40px;
  width: 40px;
  background: white;
  border: 2px solid rgba(0,0,0,0.2);
  background-clip: padding-box;
  box-shadow: 5px 6px 9px 4px rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  .locationIconMap {
    width: 70%;
    padding: 15%;
    height: 70%;
  }
}
.closeWidget {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $white;
  @media (max-width: 767px) {
    font-weight: bold;
    border-radius: 5px;
    background: transparent;
    top: 12px;
    width: 38px;
  }
  .closeBtn {
    filter: contrast(30%);
    margin: 0;
    cursor: pointer;
    background-size: cover;
    background: url('../../assets/icons/clear.png') 0 0 no-repeat;
    width: 100%;
    height: 100%;
  }
}
.myLocationSpan {
  display: flex;
  justify-content: center;
  align-items: center;
  background: $main-color; // over
  border-radius: 50%;
  padding: 5px;
  width: 30px;
  height: 30px;
  .myLocationIcon {
    width: 40px;
    height: 40px;
    filter: brightness(0) invert(1);
  }
}
.closest-error {
  width: 55%;
  @media (max-width: 767px) {
    font-size: 14px;
  }
}
.empty-text {
  margin: 0;
  color: #e54c69;
  @media (max-width: 767px) {
    text-align: center;
  }
}
.load-box {
  display: flex;
  justify-content: center;
  .load-button {
    margin: 40px 0;
    background-color: $main-color; // over
    padding: 10px 15px;
    border-radius: 50px;
    color: $white;
    display: inline;
    text-align: center;
    cursor: pointer;
  }
}
.list-background-mobile-fix {
  background: #f5f5f5;
}
.list-modal {
  width: 100%;
  .list-modal-hours {
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    padding: 15px 0;
    font-size: 14px;
    .day-mobile {
      margin: 0;
      text-align: left;
    }
  }
  .list-modal-additional {
    display: flex;
    justify-content: space-evenly;
    .icon {
      width: 17px;
      height: 17px;
      display: flex;
    }
    .hours {
      background: url('../../assets/icons/ZEGAR.png') 0 0 no-repeat;
      background-size: cover;
    }
    .sobota {
      background: url('../../assets/icons/sobota.png') 0 0 no-repeat;
      background-size: cover;
    }
    .niedziela {
      background: url('../../assets/icons/niedziela.png') 0 0 no-repeat;
      background-size: cover;
    }
    .parking {
      background: url('../../assets/icons/parking.png') 0 0 no-repeat;
      background-size: cover;
    }
    .pobraniem {
      background: url('../../assets/icons/za-pobraniem.png') 0 0 no-repeat;
      background-size: cover;
    }
    .niepelnosprawni {
      background: url('../../assets/icons/niepelnosprawni.png') 0 0 no-repeat;
      background-size: cover;
    }
  }
}
.map {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  max-height: 100vh;
  position: relative;
}
.map-v2 {
  position: relative;
  width: 100%;
  height: calc(100vh - 110px);
  overflow: hidden;
  max-height: calc(100vh - 110px);
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
    box-shadow: 5px 6px 9px 4px rgba(0, 0, 0, 0.4);
  justify-content: center;
  background-color: #00000054;
  p {
    margin: 0;
    padding: 15px;
    border-radius: 5px;
    color: $main-color; // over
    font-weight: 700;
    text-transform: uppercase;
    background-color: $white;
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
    color: $main-color; // over
    font-weight: 700;
    text-transform: uppercase;
    background-color: $white;
    box-shadow: 5px 6px 9px 4px rgba(0, 0, 0, 0.4);
  }
}
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
.type-actions {
  .button-action {
    &.active {
      color: $white;
      background-color: $main-color; // over
    }
    color: $second-grey;
    background-color: $light-grey;
    padding: 8px 40px 10px 40px;
    margin: 0;
    cursor: pointer;
    @media (max-width: 767px) {
      padding: 8px 32px 8px 32px;
    }
  }
  position: absolute;
  z-index: 999;
  right: 75px;
  top: 10px;
  background-color: white;
  display: flex;
  border-radius: 15px;
  overflow: hidden;
  @media (max-width: 767px) {
    position: fixed;
    right: 45px;
    left: auto;
    top: 12px;
  }
}
.box-shadow {
  box-shadow: 5px 6px 9px 4px rgba(0, 0, 0, 0.4);
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
        font-size: 14px;
        margin: 5px 0;
        background-color: $main-color; // over
        padding: 5px 10px;
        border-radius: 15px;
        color: $white;
        display: inline;
        text-align: center;
        cursor: pointer;
        @media (max-width: 1100px) {
          font-size: 12px;
          padding: 5px 6px;
        }
      }
      text-align: center;
      flex-basis: 15%;
      max-width: 15%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .address-parag {
        margin: 0;
      }
    }
    .list-elem-address {
      flex-basis: 30%;
      max-width: 30%;
    }
    .hours-elem {
      flex-basis: 20%;
      max-width: 20%;
    }
    .btn-elem {
      flex-basis: 35%;
      max-width: 35%;
      display: flex;
      flex-direction: column;
      .list-link {
        color: $second-grey;
        text-decoration: underline $main-color; // over
      }
    }
    padding: 20px 0;
    border-bottom: 1px solid #aaaaaa;
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
    border: 1px solid #aaaaaa;
  }
  height: 100vh;
  margin-top: 80px;
  padding: 0px 20px;
  text-align: left;
}
.listbox-margin-top {
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
.modal-positionV2 {
  left: 0;
  width: 55%;
}
.change-vh {
  min-height: 81vh !important;
}
// transitions
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
  transition: all 0.3s ease;
}
.bounce-leave-active {
  animation: bounce-out 0.5s reverse;
}
.bounce-enter {
  transition: all 0.3s ease;
  transform: translateY(20%);
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    right: 0;
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
// animation end
@media only screen and (max-width: 1100px) {
  .type-actions {
    .button-action {
      font-size: 14px;
    }
  }
  .list-box {
    padding: 0 10px;
    .list-title {
      font-size: 17px;
    }
    .list-row {
      .list-elem {
        font-size: 14px;
        img {
          height: 65px;
        }
      }
    }
  }
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
