<template>
<div class='list-background-fix'>
  <div :class="isWidgetVersion ? 'map-v2' : 'map'">
    <div class="type-actions" :class="{'type-actions-v2' : !isWidgetVersion}">
      <p class="button-action" :class="{ 'active' : !toogleMap }" @click="toogleMapMethod()">Mapa</p>
      <p class="button-action" :class="{ 'active' : toogleMap }" @click="toogleMapMethod()">Lista</p>
    </div>
    <transition name="fade">
      <template v-if="toogleMap">
        <div class="list-box" :class="{'listbox-margin-top' : isWidgetVersion}">
          <div class="list-title hidden-xs">Punkty odbioru w pobliżu Twojej lokalizacji</div>
          <div class="scroll-box" :class="{'change-vh' : !isWidgetVersion}">
            <div class="list-row" :class="{'list-row-modal' : isOpenListModal(index)}"
              v-for="(marker, index) in markers"
              :key="marker.id"
              @click="openListModal(index)">
              <div class="list-elem list-elem-img">
                <img :class="{'img-modal' : isOpenListModal(index)}" :src="logosUrl[marker.type]" width="auto" height="70px" />
              </div>
              <div class="list-elem">
                <b>{{ marker.address1 }}</b>
                {{ marker.zip }}
                {{ marker.address2 }}
              </div>
              <div class="list-elem hours-elem">
                <b>Godziny otwarcia:</b>
                {{ marker.openTime }}<br>
                {{ marker.openTime2 }}
              </div>
              <div class="list-elem btn-elem">
                <p class="list-button" @click="selectedPopup(index)">Wybierz</p>
              </div>
              <!-- List Modal Section -->
              <transition name="fade">
              <div class="list-modal" v-if="isOpenListModal(index)">
                <div class="list-modal-hours">
                  <b>Godziny otwarcia:</b>
                  {{ marker.openTime }}<br>
                  {{ marker.openTime2 }}
                </div>
                <div class="list-modal-additional">
                  <i class="icon hours"/>
                  <i class="icon sobota"/>
                  <i class="icon niedziela"/>
                </div>
              </div>
              </transition>
              <!-- List Modal Section END -->
            </div>
          </div>
        </div>
      </template>
    </transition>
    <transition name="fade">
      <template v-if="!toogleMap">
        <l-map
          :zoom="zoom"
          :center="center"
          :options="{zoomControl: false}"
          @update:zoom="zoomUpdated"
          @update:center="centerUpdated"
          @update:bounds="boundsUpdated"
        >
            <!-- <l-control-zoom position="bottomleft"></l-control-zoom> -->
            <l-tile-layer :url="url" :attribution="attribution" />
            <template v-if="markers[0] !== 'empty'">
              <l-marker
                v-for="(marker, index) in markers"
                :key="marker.id"
                :visible="marker.visible"
                :lat-lng="marker.position"
                class-name="markertype"
              >
                <l-icon :icon-anchor="marker.iconAnchor" :icon-size="marker.iconSize" class-name="someExtraClass">
                  <img :src="pinsUrl[marker.type]" width="52" height="52"/>
                </l-icon>
                <transition name="bounce">
                <l-popup>
                  <div class="popup-box">
                    <img class="popup-marker" :src="pinsUrl[marker.type]" width="102" height="102"/>
                    <div class="popup-info">
                      <div class="popup-text-box">
                        <p class="popup-text">
                          <b>Mniszew 25 </b><br> 26910 Magnuszew, <br>PL13883
                        </p>
                      </div>
                      <div class="popup-img" >
                        <img :src="logosUrl[marker.type]" width="100%" height="auto"/>
                      </div>
                    </div>
                    <div class="popup-action">
                      <p class="popup-button" @click="selectedPopup(index)">Wybierz</p>
                    </div>
                  </div>
                </l-popup>
                </transition>
              </l-marker>
            </template>
        </l-map>
      </template>
    </transition>
  </div>
    <div>
      <transition name="bounce">
        <div class="modal-position" :class="{'modal-positionV2' : !isWidgetVersion}" v-if="toogleModal">
          <ModalDiv :parentData="selectedMarker" :toogleModal="toogleModal" @close="onCloseChild"/>
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

export default {
  name: 'Home',
  components: {
    ModalDiv,
    // maps components
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LControlZoom,
    LIcon
  },
  data () {
    return {
      isListFooter: false,
      selectedPoint: Number,
      toogleMap: false,
      toogleModal: false,
      geoCenter: {
        lat: 0,
        lng: 0
      },
      // markers: null,
      selectedMarker: {},
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      logosUrl: {
        zabka: require('../../assets/logos/żabka.png'),
        dpd: require('../../assets/logos/dpd.png'),
        dpdPickup: require('../../assets/logos/dpd-pickup.png'),
        fresh: require('../../assets/logos/freshmarket.png'),
        inpost: require('../../assets/logos/inpost.png'),
        pocztaPolska: require('../../assets/logos/pocztapolska.png')
      },
      pinsUrl: {
        zabka: require('../../assets/zabka.png'),
        dpd: require('../../assets/dpd.png'),
        dpdPickup: require('../../assets/dpdpickup.png'),
        fresh: require('../../assets/fresh.png'),
        inpost: require('../../assets/inpost.png'),
        pocztaPolska: require('../../assets/poczta-polska.png')
      }
    }
  },
  computed: {
    // calc () {
    //   console.log(Math.sqrt((52.2353 - 52.2241)*(52.2353 - 52.2241)+(21.0150 - 21.0032) * (21.0150 - 21.0032)))
    // },
    zoom () {
      return this.$store.state.zoom
    },
    center () {
      return latLng(this.$store.state.lat, this.$store.state.lng)
    },
    markers () {
      if (this.$store.state.filteredMarkers.length > 0) {
        return this.$store.state.filteredMarkers
      } else {
        return this.$store.state.markers
      }
    },
    isWidgetVersion () {
      return this.$store.state.WidgetVersion
    }
  },

  // mounted () {
  //   this.$store.subscribe((mutation, state) => {
  //     if (mutation.type === 'geolocation/LOCATION_CHANGED') {
  //       this.geoCenter.lat = parseFloat(this.$store.state.geolocation.lat)
  //       this.geoCenter.lng = parseFloat(this.$store.state.geolocation.lng)

  //       this.$store.dispatch('get_points', {
  //         lat: this.geoCenter.lat,
  //         lng: this.geoCenter.lng,
  //         dist: 14
  //       })
  //     }
  //     if (mutation.type === 'get_points_succ') {
  //       this.markers = this.$store.state.markers
  //     }
  //   })
  // },

  methods: {
    toogleMapMethod () {
      this.toogleMap = !this.toogleMap
      this.$store.commit('closeListFooter')
    },
    zoomUpdated (zoom) {
      this.$store.commit('updatePosition', [{ lat: null, lng: null, zoom: zoom }])
    },
    centerUpdated (center) {
      this.$store.commit('updatePosition', [{ lat: center.lat, lng: center.lng, zoom: null }])
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
    selectedPopup (index) {
      this.toogleModal = false
      setTimeout(() => this.toogleMethod(index), 500)
    },
    toogleMethod (index) {
      this.toogleModal = true
      if (this.toogleModal === true) {
        this.selectedMarker = this.markers[index]
      }
    },
    onCloseChild (value) {
      this.toogleModal = value
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
.leaflet-popup {
  .leaflet-popup-content-wrapper {
    border: 3px solid #3F87F5;
  }
  .leaflet-popup-tip-container {
    display: none;
  }
  .leaflet-popup-close-button {
    display: none;
  }
  padding-right: 210px !important;
  bottom: -210px !important;
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
</style>

<style lang="scss" scoped>
// list modal styles
.list-background-fix{
  background: #F5F5F5;
}
.list-modal{
  .list-modal-hours{
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 15px 0;
    font-size: 14px;
  }
  .list-modal-additional{
    display: flex;
    justify-content: space-around;
    .icon{
      width: 17px;
      height: 17px;
      display: flex;
    }
    .hours{
      background: url('../../assets/ZEGAR.png') 0 0 no-repeat;
      background-size: cover;
    }
    .sobota{
      background: url('../../assets/sobota.png') 0 0 no-repeat;
      background-size: cover;
    }
    .niedziela{
      background: url('../../assets/niedziela.png') 0 0 no-repeat;
      background-size: cover;
    }
  }
}
// list modal style END
.map{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  max-height: 100vh;
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
.popup-info {
  width: 200px;
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
  left: -20px;
  top: -92px;
}
.type-actions {
  .button-action {
    &.active {
      color: white;
      background-color: #E54C69;
    }
    color: #AAAAAA;
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
}
.type-actions-v2{
  left: auto;
  right: 20px;
  top: 20px;
}
.hours-elem{
  flex-basis: 30% !important;
  max-width: 30% !important;
  text-align: right !important;
}
.btn-elem{
  flex-basis: 20% !important;
  max-width: 20% !important;
}
.list-box {
  .list-title {
    font-weight: 700;
    font-size: 22px;
    padding: 10px 0;
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
      flex-basis: 25%;
      max-width: 25%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    }
    padding: 20px 0;
    border-bottom: 1px solid #AAAAAA;
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .scroll-box {
    overflow-y: scroll;
    height: 70vh;
    border: 1px solid #AAAAAA;
  }
  margin-top: 105px;
  padding: 0px 20px;
  text-align: left;
}
.listbox-margin-top{
  margin-top: 55px !important;
}
.modal-position {
  width: 55%;
  position: absolute;
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
  min-height: 79vh !important;
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
    bottom: 0;
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

@media only screen and (max-width: 1100px) {
 .type-actions{
   .button-action{
     font-size: 14px;
     padding: 8px 30px 8px 30px;
   }
 }
.type-actions-v2{
   .button-action{
     font-size: 14px;
     padding: 8px 30px 8px 30px;
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

// Styles for mobile
@media (max-width: 767px) {
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
        }
          .list-elem{
            flex-basis: 37%;
            max-width: 37%;
            justify-content: normal;
            .img-modal{
               filter: none;
               height: 65px;
               padding-right: 20px;
            }
            img{
              filter: grayscale(1) opacity(0.6);
              height: 55px;
            }
          }
          .list-elem-img{
                justify-content: center;
                margin-right: -25px;
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
