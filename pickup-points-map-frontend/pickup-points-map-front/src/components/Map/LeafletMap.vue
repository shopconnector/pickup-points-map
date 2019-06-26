<template>
  <div class="map">
    <div class="type-actions">
      <p class="button-action" :class="{ 'active' : !toogleMap }" @click="toogleMap = !toogleMap">Mapa</p>
      <p class="button-action" :class="{ 'active' : toogleMap }" @click="toogleMap = !toogleMap">Lista</p>
    </div>
    <transition name="fade">
      <template v-if="toogleMap">
        <!-- <div class="list-title">Punkty odbioru w pobliżu Twojej lokalizacji</div> -->
        <div class="list-box">
          <div class="list-title">Punkty odbioru w pobliżu Twojej lokalizacji</div>
          <div class="scroll-box">
            <div class="list-row"
              v-for="marker in markers"
              :key="marker.id">
              <div class="list-elem">
                <img :src="logosUrl[marker.type]" width="auto" height="70px"/>
              </div>
              <div class="list-elem">
                <b>{{ marker.address1 }}</b>
                {{ marker.zip }}
                {{ marker.address2 }}
              </div>
              <div class="list-elem">
                <b>Godziny otwarcia:</b>
                {{ marker.openTime }}<br>
                {{ marker.openTime2 }}
              </div>
              <div class="list-elem">
                <p class="list-button" @click="toogleTest = !toogleTest">Wybierz</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </transition>
    <transition name="fade">
      <template v-if="!toogleMap">
        <l-map :zoom="zoom" :center="center" :options="{zoomControl: false}">
            <l-control-zoom position="topright"></l-control-zoom>
            <l-tile-layer :url="url" :attribution="attribution" />
            <!-- <marker-popup :position="marker" :text="text" :title="title" />
            <l-marker :lat-lng="marker1" /> -->
            <l-marker
              v-for="marker in markers"
              :key="marker.id"
              :visible="marker.visible"
              :lat-lng="marker.position"
              class-name="markertype"
            >
              <!-- <l-icon
                :icon-size="iconSize"
                :icon-anchor="iconAnchor"
                :icon-url="iconUrl"
              /> -->
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
                    <p class="popup-button" @click="toogleTest = !toogleTest">Wybierz</p>
                  </div>
                </div>
              </l-popup>
            </l-marker>
        </l-map>
      </template>
    </transition>
    <transition name="bounce">
      <div class="testdiv" v-if="toogleTest">
        <!-- {{ $store.state.geolocation }} -->
        <!-- <p @click="useMyGeo()">use my geo</p> -->
        asdasd
        {{ geoCenter }}
      </div>
    </transition>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LTooltip, LControlZoom, LIcon } from 'vue2-leaflet'
import { latLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import MarkerPopup from './MarkerPopup'

export default {
  name: 'Home',
  components: {
    // maps components
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LControlZoom,
    MarkerPopup,
    LIcon
  },
  data () {
    return {
      toogleMap: false,
      toogleTest: false,
      zoom: 14,
      center: latLng(52.235948, 21.030750),
      geoCenter: '',
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      text: 'my marker popup text',
      title: 'My marker popup title',
      logosUrl: {
        zabka: require('../../assets/żabka-logo.png'),
        dpd: require('../../assets/dpd-logo.png'),
        dpdPickup: require('../../assets/dpd-pickup-logo.png'),
        fresh: require('../../assets/freshmarket-logo.png'),
        inpost: require('../../assets/inpost-logo.png'),
        pocztaPolska: require('../../assets/pocztapolska-logo.png')
      },
      pinsUrl: {
        zabka: require('../../assets/zabka.png'),
        dpd: require('../../assets/dpd.png'),
        dpdPickup: require('../../assets/dpdpickup.png'),
        fresh: require('../../assets/fresh.png'),
        inpost: require('../../assets/inpost.png'),
        pocztaPolska: require('../../assets/poczta-polska.png')
      },
      markers: [
        {
          id: 'm1',
          position: { lat: 52.229676, lng: 21.012229 },
          tooltip: 'tooltip for marker1',
          address1: 'Mazowiecka 50A',
          address2: 'Warszawa',
          zip: '02776',
          openTime: 'pn - pt: 8:00 - 18:00',
          openTime2: 'so: 8:00 - 16:00',
          visible: true,
          openSat: true,
          openSun: true,
          openNight: true,
          disabledPeople: true,
          parking: true,
          cashOnDelivery: true,
          type: 'zabka',
          icon: {
            iconUrl: '../../assets/zabka.png',
            iconSize: [52, 52],
            iconAnchor: [26, 52]
          }
        },
        {
          id: 'm2',
          position: { lat: 52.239050, lng: 21.046113 },
          tooltip: 'tooltip for marker2',
          address1: 'Mazowiecka 50A',
          address2: 'Warszawa',
          zip: '02776',
          openTime: 'pn - pt: 8:00 - 18:00',
          openTime2: 'so: 8:00 - 16:00',
          visible: true,
          openSat: true,
          openSun: true,
          OpenNight: true,
          disabledPeople: true,
          parking: true,
          cashOnDelivery: true,
          type: 'dpd',
          icon: {
            iconUrl: '../../assets/dpd.png',
            iconSize: [52, 52],
            iconAnchor: [26, 52]
          }
        },
        {
          id: 'm3',
          position: { lat: 52.228740, lng: 21.033668 },
          tooltip: 'tooltip for marker3',
          address1: 'Mazowiecka 50A',
          address2: 'Warszawa',
          zip: '02776',
          openTime: 'pn - pt: 8:00 - 18:00',
          openTime2: 'so: 8:00 - 16:00',
          visible: true,
          openSat: true,
          openSun: true,
          OpenNight: true,
          disabledPeople: true,
          parking: true,
          cashOnDelivery: true,
          type: 'inpost',
          icon: {
            iconUrl: '../../assets/inpost.png',
            iconSize: [52, 52],
            iconAnchor: [26, 52]
          }
        },
        {
          id: 'm4',
          position: { lat: 52.235238, lng: 21.008434 },
          tooltip: 'tooltip for marker4',
          address1: 'Mazowiecka 50A',
          address2: 'Warszawa',
          zip: '02776',
          openTime: 'pn - pt: 8:00 - 18:00',
          openTime2: 'so: 8:00 - 16:00',
          visible: true,
          openSat: true,
          openSun: true,
          OpenNight: true,
          disabledPeople: true,
          parking: true,
          cashOnDelivery: true,
          type: 'dpdPickup',
          icon: {
            iconUrl: '../../assets/dpdpickup.png',
            iconSize: [52, 52],
            iconAnchor: [26, 52]
          }
        },
        {
          id: 'm5',
          position: { lat: 52.233949, lng: 21.017360 },
          tooltip: 'tooltip for marker5',
          address1: 'Mazowiecka 50A',
          address2: 'Warszawa',
          zip: '02776',
          openTime: 'pn - pt: 8:00 - 18:00',
          openTime2: 'so: 8:00 - 16:00',
          visible: true,
          openSat: true,
          openSun: true,
          OpenNight: true,
          disabledPeople: true,
          parking: true,
          cashOnDelivery: true,
          type: 'fresh',
          icon: {
            iconUrl: '../../assets/fresh.png',
            iconSize: [52, 52],
            iconAnchor: [26, 52]
          }
        },
        {
          id: 'm6',
          position: { lat: 52.234949, lng: 21.015360 },
          tooltip: 'tooltip for marker6',
          address1: 'Mazowiecka 50A',
          address2: 'Warszawa',
          zip: '02776',
          openTime: 'pn - pt: 8:00 - 18:00',
          openTime2: 'so: 8:00 - 16:00',
          visible: true,
          openSat: true,
          openSun: true,
          OpenNight: true,
          disabledPeople: true,
          parking: true,
          cashOnDelivery: true,
          type: 'pocztaPolska',
          icon: {
            iconUrl: '../../assets/poczta-polska.png',
            iconSize: [52, 52],
            iconAnchor: [26, 52]
          }
        }
      ]
    }
  }
  // methods: {
  //   useMyGeo () {
  //     this.geoCenter = this.$store.state.geolocation
  //   }
  // }
}
</script>

<style lang="scss">
// .leaflet-container .leaflet-marker-pane img {
//   background-image: url(../../assets/dpd.png) !important;
//   background-position: center !important;
//   width: 33px !important;
//   background-repeat: no-repeat !important;
//   background-size: cover !important;
// }
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
.popup-info {
  width: 200px;
  .popup-text-box {
    width: 70%;
  .popup-text {
    margin: 0;
    // padding: 0 10px;
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
  border-radius: 15px;
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
  left: 60px;
  top: 60px;
  background-color: white;
  display: flex;
  border-radius: 15px;
  overflow: hidden;
}
.list-box {
  .list-title {
    font-weight: 700;
    font-size: 22px;
  }
  .list-row {
    .list-elem {
      .list-button {
        margin: 5px 0;
        background-color: #E4405F;
        padding: 5px 30px;
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
    padding: 10px 0;
    border-bottom: 1px solid #AAAAAA;
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .scroll-box {
    overflow-y: scroll;
    height: 70vh;
  }
  margin-top: 150px;
  padding: 0px 60px 0 60px;
  text-align: left;
}
.testdiv {
  width: 40%;
  height: 200px;
  background-color: #E4405F;
  border-radius: 50px;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 999;
  transition: 0.3s all;
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
    // background-color: blue;
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
  // 50% {
  //   transform: scale(0.5);
  // }
  100% {
    transform: scale(1);
  }
}

</style>
