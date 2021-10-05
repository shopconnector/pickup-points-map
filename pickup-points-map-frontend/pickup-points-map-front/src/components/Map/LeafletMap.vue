<template>
  <div :class="{ 'list-background-mobile-fix': isMobile }">
    <div :class="isWidgetVersion ? 'map-v2' : 'map'">
      <div class="type-actions">
        <p class="button-action" :class="{ 'active': !toogleMap }" :style="{ backgroundColor: !toogleMap ? getActive : '' }" @click="toogleMapMethod(), openListModal(9999)">Mapa</p>
        <p class="button-action" :class="{ 'active': toogleMap }" :style="{ backgroundColor: toogleMap ? getActive : '' }" @click="toogleMapMethod()">
          Lista
        </p>
      </div>
      <div class="closeWidget">
        <p class="closeBtn" @click="closeWidget()" />
      </div>
      <div v-if="this.$store.state.geolocation.error.code === 1 && !Object.keys(pointMarkers).length" class="first-enter-info">
        <p class="error-text" :style="getColor">
          Wybierz adres/lokalizację aby
          <br />zobaczyć najbliższe punkty odbioru
          <span class="mt10">Uwaga: Lokalizacja dla tej domeny jest zablokowana. <br />Możesz ponownie włączyć w ustawieniach przeglądarki.</span>
        </p>
      </div>
      <div
        v-else-if="$store.state.status === 'error, points couldnt be loaded' || $store.state.status === 'error, list points couldnt be loaded'"
        class="first-enter-info"
      >
        <p :style="getColor">Nie znaleziono żadnego punktu. Zmień kryteria wyboru.</p>
      </div>
      <div v-else-if="$store.state.closestPunktErrors.length > 0 && Object.keys(pointMarkers).length === 10 && !toogleMap" class="error-info">
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
                <img :class="{ 'img-modal': isOpenListModal(index) }" :src="getImgUrl(logosUrl[listMarker.pickup_point_type])" width="auto" height="70px" />
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
                <p class="list-button" :style="getBackgroundColor" @click="getPointListDetails(listMarker.lat, listMarker.lon, listMarker.pickup_point_type, listMarker.id)">Wybierz i wróć do zamówienia</p>
                <a class="list-link" :style="getDecorationColor" :href="linkToRoadMap(listMarker)" target="_blank">Wyznacz trasę dojazdu</a>
              </div>
              <transition name="fade">
                <div class="list-modal" v-if="isOpenListModal(index) && isMobile && $store.state.markerDetails">
                  <template v-if="$store.state.markerDetails.points">
                    <div class="list-modal-hours" v-if="$store.state.markerDetails.points[0].working_hours.length > 0">
                      <b>Godziny otwarcia:</b>
                      <div v-for="(day, index) in $store.state.markerDetails.points[0].working_hours" :key="index">
                        <p class="day-mobile">{{ day }}</p>
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
      <LeafletMap />
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MobileDetected } from '../mobileDetected.ts'
import { mapGetters } from 'vuex'
import LeafletMap from './Map'

export default {
  name: 'Home',
  components: {
    LeafletMap
  },
  mixins: [MobileDetected],
  data () {
    return {
      result: null,
      dataToSend: {
        pickup_type: '',
        points: {},
        street: '',
        city: '',
        zip: ''
      },
      loader: false,
      clusterOptions: {
        disableClusteringAtZoom: 17,
        chunkedLoading: true
      },
      selectedPoint: Number,
      toogleMap: false,
      closeButton: false,
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
      }
    }
  },
  computed: {
    getDecorationColor () {
      if (this.$store.state.customer.options) {
        return 'text-decoration-color:' + this.$store.state.customer.options.primary_color
      }
    },
    getColor () {
      if (this.$store.state.customer.options) {
        return 'color:' + this.$store.state.customer.options.primary_color
      }
    },
    getActive () {
      return this.$store.state.customer.options.primary_color
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
    ...mapGetters({
      getZoom: 'getZoom',
      getCurrentLat: 'getCurrentLat',
      getCurrentLng: 'getCurrentLng'
    }),
    pointMarkers () {
      return this.$store.state.pointMarkers
    },
    listMarkers () {
      return this.$store.state.listMarkers
    },
    isWidgetVersion () {
      return this.$store.state.customer.theme
    },
    centerUpdateOrFiltersUpdate () {
      return [
        this.getCurrentLat,
        this.$store.state.storeFilters.features,
        this.$store.state.storeFilters.checkedSuppliers
      ].join()
    },
    filtersUpdate () {
      return [this.$store.state.storeFilters.features, this.$store.state.storeFilters.checkedSuppliers].join()
    }
  },
  watch: {
    filtersUpdate: {
      handler () {
        this.$store.dispatch('get_list_points', {
          lat: `lat=${this.getCurrentLat}`,
          lng: `&lon=${this.getCurrentLng}`,
          key: `&key=${this.$store.state.customer.key}`,
          page: `&page=${this.$store.state.pageNumber}`,
          filtered: this.filteredPoints(),
          id: ''
        })
      }
    }
  },
  methods: {
    getImgUrl (pic) {
      if (pic) {
        return require('../../assets/logos/' + pic)
      } else {
        return require('../../assets/logos/404.png')
      }
    },
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
    getPointMobileListDetails (lat, lng, type, id) {
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
        lat: `lat=${this.getCurrentLat}`,
        lng: `&lon=${this.getCurrentLng}`,
        key: `&key=${this.$store.state.customer.key}`,
        page: `&page=${this.$store.state.pageNumber}`,
        filtered: this.filteredPoints(),
        id: ''
      })
    },
    toogleMapMethod () {
      this.$store.commit('closeFooterModal')
      this.toogleMap = !this.toogleMap
      this.$store.dispatch('get_list_points', {
        lat: `lat=${this.getCurrentLat}`,
        lng: `&lon=${this.getCurrentLng}`,
        key: `&key=${this.$store.state.customer.key}`,
        page: `&page=${this.$store.state.pageNumber}`,
        filtered: this.filteredPoints(),
        id: ''
      })
      this.toogleMethod('false')
      this.$store.commit('closeListFooter')
    },
    centerUpdated (center) {
      if (center.lat !== this.getCurrentLat && center.lng !== this.getCurrentLng) this.$store.commit('updatePosition', [{ lat: center.lat, lng: center.lng, zoom: null }])
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
  box-shadow: 5px 6px 9px 4px rgba(0, 0, 0, 0.4);
  @media (max-width: 767px) {
    box-shadow: none;
    position: fixed;
    right: 45px;
    left: auto;
    top: 12px;
  }
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
</style>
