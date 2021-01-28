<template>
  <div>
    <!-- Modal DIV for mobile map -->
    <div class="mobile-map-modal" v-if="isMobile">
      <div class="mobile-map-header">
        <p>Wybrany punkt</p>
        <i class="close-icon close-mobile-map-modal" @click="closeModal()"/>
      </div>
      <template v-for="(point, index) in parentData.points">
      <div class="mobile-map-row" :key="'logo-' + index">
        <div class="mobile-map-logo">
          <img :src="getImgUrl(logosUrl[parentData.pickup_type])" class="img">
        </div>
        <div class="mobile-map-address">
          <h4 class="mobile-map-title">{{ parentData && parentData.street }}</h4>
          <p class="mobile-map-street">{{ parentData && parentData.zip }} {{ parentData && parentData.city }}</p>
          <p v-if="parentData.points && point.id.length" class="mobile-map-street"><img class="popup-icon" :src="popupIcons[parentData.pickup_type]" />{{ parentData.points && point.id }}</p>
        </div>
      </div>
      <div class="mobile-map-hours" v-if="point && point.working_hours.length > 0 && point.working_hours[0] !== ''" :key="'hours-' + index">
        <div class="mobile-map-hours-title">
          <b>Godziny otwarcia:</b>
        </div>
        <div class="mobile-map-hours-info">
            <template v-for="(day, index) in point.working_hours">
              <p class="day-p" :key="index">{{ day }}</p>
            </template>
        </div>
      </div>
      <div class="mobile-map-additional" :key="'add-' + index">
        <p v-if="parentData.points && point.features.open_late" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon hours"/></span> - otwarte do pózna</p>
        <p v-if="parentData.points && point.features.open_saturday" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon sobota"/></span> - otwarte w soboty</p>
        <p v-if="parentData.points && point.features.open_sunday" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon niedziela"/></span> - otwarte w niedziele</p>
        <p v-if="parentData.points && point.features.parking" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon parking"/></span> - parking</p>
        <p v-if="parentData.points && point.features.disabled_friendly" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon niepelnosprawni"/></span> - ułatwienie dla osób niepełnosprawnych</p>
        <p v-if="parentData.points && point.features.cash_on_delivery" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon pobraniem"/></span> - odbiór za pobraniem</p>
      </div>
      <div class="mobile-map-footer" :key="'btn-' + index">
        <p class="mobile-map-btn-close" :style="getBackgroundColor" @click="closeModal(); setPoint(parentData, point);">Wybierz i wróć do zamówienia</p>
        <!-- Wybierz "{{ parentData.pickup_type }}" i zamknij -->
      </div>
      </template>
    </div>
    <!-- End -->
  </div>
</template>

<script>
import { MobileDetected } from '../mobileDetected.ts'

export default {
  name: 'ModalDiv',
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
        'AUTOMAT SPOLEM': 'spolem.png',
        'AUTOMAT BIEDRONKA': 'biedronka.png',
        'AUTOMAT CARREFOUR': 'carrefour.png',
        'AUTOMAT LEWIATAN': 'lewiatan.png'
      }
    }
  },
  computed: {
    getBackgroundColor () {
      if (this.$store.state.customer.options) {
        return 'background:' + this.$store.state.customer.options.primary_color
      }
    },
    parentData () {
      return this.$store.state.markerDetails
    },
    selectedPoint () {
      return this.$store.state.selectedPoint
    },
    linkToRoad () {
      if (this.$store.state.geolocation.lat && this.$store.state.suggestionTextLocit.length === 0 && this.$store.state.linkToRoad.x === 0) {
        let url = 'https://www.google.pl/maps/dir/' + this.$store.state.geolocation.lat + ',' + this.$store.state.geolocation.lng + '/' + this.parentData.lat + ',' + this.parentData.lon + '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'
        return url
      } else if (this.$store.state.linkToRoad.x > 0 && this.$store.state.suggestionTextLocit.length === 0) {
        let url = 'https://www.google.pl/maps/dir/' + this.$store.state.linkToRoad.x + ',' + this.$store.state.linkToRoad.y + '/' + this.parentData.lat + ',' + this.parentData.lon + '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'
        return url
      } else {
        let url = 'https://www.google.pl/maps/dir/' + this.$store.state.suggestionTextLocit.city + ',' + this.$store.state.suggestionTextLocit.street + ',' + this.$store.state.suggestionTextLocit.building + '/' + this.parentData.lat + ',' + this.parentData.lon + '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'
        return url
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
    setPoint (points, selected) {
      this.dataToSend.pickup_type = points.pickup_type
      this.dataToSend.street = points.street
      this.dataToSend.city = points.city
      this.dataToSend.zip = points.zip
      this.dataToSend.points = selected
      this.sendMessage(this.dataToSend)
    },
    sendMessage (point) {
      window.parent.postMessage(point, '*')
    },
    closeModal () {
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.day-p {
  padding-left: 3px;
}
.mobile-map-modal{
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  max-height: 345px;
  background: $white;
  .mobile-map-header{
    display: flex;
    justify-content: center;
    padding-top: 10px;
    font-size: 18px;
    font-weight: 700;
    .close-mobile-map-modal{
      position: absolute;
      right: 15px;
      top: 10px;
    }
    .close-icon{
      display: flex;
      filter: contrast(30%);
      margin: 0;
      background-size: cover;
      background: url('../../assets/icons/clear.png') 0 0 no-repeat;
      width: 30px;
      height: 30px;
    }
  }
  .mobile-map-row{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
    .mobile-map-logo{
      padding-right: 20px;
    }
    .mobile-map-address{
      display: flex;
      flex-direction: column;
      text-align: left;
      .mobile-map-title{
        margin: 0;
      }
      .mobile-map-street{
        font-size: 14px;
        display: flex;
        align-items: center;
        .popup-icon {
          margin-right: 5px;
        }
      }
    }
  }
  .mobile-map-hours{
    display: flex;
     align-items: baseline;
    .mobile-map-hours-title{
      padding-left: 15px;
      padding-right: 10px;
    }
    .mobile-map-hours-info{
      text-align: left;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      max-height: 68px;
    }
  }
  .mobile-price {
    display: flex;
    align-items: baseline;
    .mobile-price-title {
      padding-left: 15px;
      padding-right: 10px;
    }
    .mobile-price-info {
      text-align: left;
      font-size: 14px;
      display: flex;
      flex-direction: column;
    }
  }
  .mobile-map-additional{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 90px;
    padding: 12px;
    font-size: 15px;
    .additional-info{
    display: flex;
    align-items: center;
    width: 50%;
    .mobile-map-icon-padding{
      padding-right: 10px;
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
 }
 .mobile-map-footer{
   display: flex;
   justify-content: center;
   padding-bottom: 15px;
   .mobile-map-btn-close{
    color: $white;
    background: $main-color; // over
    display: flex;
    width: fit-content;
    height: 40px;
    padding: 0 15px;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
   }
 }
}
p {
  padding: 0;
  margin: 0;
}
.img{
  width: 85px;
  @media (max-width: 1000px) {
    width: 70px;
  }
}

</style>
