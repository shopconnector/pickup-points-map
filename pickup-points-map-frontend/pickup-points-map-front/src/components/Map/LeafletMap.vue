<template>
  <div class="map">
    <div class="type-actions">
      <p class="button-action" :class="{ 'active' : !toogleMap }" @click="toogleMap = !toogleMap">Mapa</p>
      <p class="button-action" :class="{ 'active' : toogleMap }" @click="toogleMap = !toogleMap">Lista</p>
    </div>
    <transition name="fade">
      <template v-if="toogleMap">
        <div class="list-box">
          <div class="list-title">Punkty odbioru w pobliżu Twojej lokalizacji</div>
          <div class="list-row"
            v-for="marker in markers"
            :key="marker.id">
            <div class="list-elem">
              image
            </div>
            <div class="list-elem">
              <b>{{ marker.address1 }}</b>
              {{ marker.address2 }}
              {{ marker.address3 }}
            </div>
            <div class="list-elem">
              <b>Godziny otwarcia:</b>
              {{ marker.openTime }}
            </div>
            <div class="list-elem">
              button
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
                <template v-if="marker.type === 'dpd'">
                  <img src="../../assets/dpd.png" width="52" height="52"/>
                </template>
                <template v-else-if="marker.type === 'zabka'">
                  <img src="../../assets/zabka.png" width="52" height="52"/>
                </template>
                <template v-else-if="marker.type === 'inpost'">
                  <img src="../../assets/inpost.png" width="52" height="52"/>
                </template>
                <template v-else-if="marker.type === 'poczta-polska'">
                  <img src="../../assets/poczta-polska.png" width="52" height="52"/>
                </template>
                <template v-else-if="marker.type === 'fresh'">
                  <img src="../../assets/fresh.png" width="52" height="52"/>
                </template>
                <template v-else-if="marker.type === 'dpdpickup'">
                  <img src="../../assets/dpdpickup.png" width="52" height="52"/>
                </template>
              </l-icon>
              <l-popup>
                <div class="popup-box">
                  <template v-if="marker.type === 'dpd'">
                    <img class="popup-marker" src="../../assets/dpd.png" width="102" height="102"/>
                  </template>
                  <template v-else-if="marker.type === 'zabka'">
                    <img class="popup-marker" src="../../assets/zabka.png" width="102" height="102"/>
                  </template>
                  <template v-else-if="marker.type === 'inpost'">
                    <img class="popup-marker" src="../../assets/inpost.png" width="102" height="102"/>
                  </template>
                  <template v-else-if="marker.type === 'poczta-polska'">
                    <img class="popup-marker" src="../../assets/poczta-polska.png" width="102" height="102"/>
                  </template>
                  <template v-else-if="marker.type === 'fresh'">
                    <img class="popup-marker" src="../../assets/fresh.png" width="102" height="102"/>
                  </template>
                  <template v-else-if="marker.type === 'dpdpickup'">
                    <img class="popup-marker" src="../../assets/dpdpickup.png" width="102" height="102"/>
                  </template>
                  <div class="popup-info">
                    <div class="popup-text-box">
                      <p class="popup-text">
                        <b>Mniszew 25 </b><br> 26910 Magnuszew, <br>PL13883
                      </p>
                    </div>
                    <div class="popup-img" >
                      <template v-if="marker.type === 'dpd'">
                        <img src="../../assets/dpd-logo.png" width="100%" height="auto"/>
                      </template>
                      <template v-else-if="marker.type === 'zabka'">
                        <img src="../../assets/żabka-logo.png" width="100%" height="auto"/>
                      </template>
                      <template v-else-if="marker.type === 'inpost'">
                        <img src="../../assets/inpost-logo.png" width="100%" height="auto"/>
                      </template>
                      <template v-else-if="marker.type === 'poczta-polska'">
                        <img src="../../assets/pocztapolska-logo.png" width="100%" height="auto"/>
                      </template>
                      <template v-else-if="marker.type === 'fresh'">
                        <img src="../../assets/freshmarket-logo.png" width="100%" height="auto"/>
                      </template>
                      <template v-else-if="marker.type === 'dpdpickup'">
                        <img src="../../assets/dpd-pickup-logo.png" width="100%" height="auto"/>
                      </template>
                    </div>
                  </div>
                  <div class="popup-action">
                    <p class="popup-button">Wybierz</p>
                  </div>
                </div>
              </l-popup>
            </l-marker>
        </l-map>
      </template>
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
      zoom: 14,
      center: latLng(52.235948, 21.030750),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      text: 'my marker popup text',
      title: 'My marker popup title',
      markers: [
        {
          id: 'm1',
          position: { lat: 52.229676, lng: 21.012229 },
          tooltip: 'tooltip for marker1',
          address1: 'Mazowiecka 50A',
          address2: 'Warszawa',
          zip: '02776',
          openTime: 'pn - pt: 8:00 - 18:00 so: 8:00 - 16:00',
          visible: true,
          openSat: true,
          openSun: true,
          OpenNight: true,
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
          openTime: 'pn - pt: 8:00 - 18:00 so: 8:00 - 16:00',
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
          openTime: 'pn - pt: 8:00 - 18:00 so: 8:00 - 16:00',
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
          openTime: 'pn - pt: 8:00 - 18:00 so: 8:00 - 16:00',
          visible: true,
          openSat: true,
          openSun: true,
          OpenNight: true,
          disabledPeople: true,
          parking: true,
          cashOnDelivery: true,
          type: 'dpdpickup',
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
          openTime: 'pn - pt: 8:00 - 18:00 so: 8:00 - 16:00',
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
          openTime: 'pn - pt: 8:00 - 18:00 so: 8:00 - 16:00',
          visible: true,
          openSat: true,
          openSun: true,
          OpenNight: true,
          disabledPeople: true,
          parking: true,
          cashOnDelivery: true,
          type: 'poczta-polska',
          icon: {
            iconUrl: '../../assets/poczta-polska.png',
            iconSize: [52, 52],
            iconAnchor: [26, 52]
          }
        }
      ]
    }
  }
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
  bottom: -210px !important;
  margin-left: 110px !important;
  margin-bottom: 0 !important;
 }
</style>

<style lang="scss" scoped>
.map{
  width: 100%;
  height: 100vh;
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
  padding: 150px 80px 0 80px;
  text-align: left;
}
.fade-enter-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
