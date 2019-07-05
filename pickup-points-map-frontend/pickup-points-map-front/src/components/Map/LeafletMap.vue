<template>
  <div :class="isWidgetVersion ? 'map-v2' : 'map'">
    <div :class="isWidgetVersion ? 'type-actions' : 'type-actions-v2'">
      <p class="button-action" :class="{ 'active' : !toogleMap }" @click="toogleMap = !toogleMap">Mapa</p>
      <p class="button-action" :class="{ 'active' : toogleMap }" @click="toogleMap = !toogleMap">Lista</p>
    </div>
    <transition name="fade">
      <template v-if="toogleMap">
        <div class="list-box" :class="{'listbox-margin-top' : isWidgetVersion}">
          <div class="list-title">Punkty odbioru w pobliżu Twojej lokalizacji</div>
          <div class="scroll-box">
            <div class="list-row"
              v-for="(marker, index) in markers"
              :key="marker.id">
              <div class="list-elem">
                <img :src="logosUrl[marker.type]" width="auto" height="70px"/>
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
            </div>
          </div>
        </div>
      </template>
    </transition>
    <transition name="fade">
      <template v-if="!toogleMap">
        <l-map :zoom="zoom" :center="center" :options="{zoomControl: false}">
            <l-control-zoom position="bottomleft"></l-control-zoom>
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
              </l-marker>
            </template>
        </l-map>
      </template>
    </transition>
    <transition name="bounce">
      <div class="modal-position" :class="{'modal-positionV2' : !isWidgetVersion}" v-if="toogleModal">
        <ModalDiv :parentData="selectedMarker" :toogleModal="toogleModal" @close="onCloseChild"/>
      </div>
    </transition>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LTooltip, LControlZoom, LIcon } from 'vue2-leaflet'
import { latLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
// import { mapState } from 'vuex'

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
      toogleMap: false,
      toogleModal: false,
      geoCenter: '',
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
  methods: {
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
</style>

<style lang="scss" scoped>
.map{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  max-height: 100vh;
}
.map-v2{
  width: 100%;
  height: 84.3vh;
  overflow: hidden;
  max-height: 100vh;
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
  top: 140px;
  background-color: white;
  display: flex;
  border-radius: 15px;
  overflow: hidden;
}
.type-actions-v2{
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
  right: 60px;
  top: 25px;
  background-color: white;
  display: flex;
  border-radius: 15px;
  overflow: hidden;
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
    padding-bottom: 20px;
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
  margin-top: 150px;
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

</style>
