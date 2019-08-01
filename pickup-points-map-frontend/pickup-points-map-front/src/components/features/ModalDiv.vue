<template>
  <div>
    <div :class="!isWidgetVersion ? 'modal' : 'modalV2'" v-if="!isMobile">
       <div class="content">
          <div class="title"><h3>Wybrany sposób dostawy</h3></div>
          <div class="selected-supplier">
            <div class="col-1">
              <div class="address">
                <h4>{{ parentData.street }}</h4>
                <p>{{ parentData.zip }} {{ parentData.city }}</p>
                <p v-if="parentData.points && parentData.points[0].id.length > 0" >{{ parentData.points[0].id }}</p>
              </div>
              <div class="shop paddbott">
                <p>{{ parentData.pickup_type }}</p>
                <p v-if="parentData.point && parentData.points[0].phones.length" >
                  <template v-for="phone in parentData.points[0].phones">
                    {{ phone }}
                  </template>
                </p>
              </div>
              <div class="shop additional" v-if="parentData && parentData.length">
                <p v-if="parentData.point && parentData.points[0].features.open_late"> Otwarte do pózna</p>
                <p v-if="parentData.point && parentData.points[0].features.open_saturday"> Otwarte w soboty</p>
                <p v-if="parentData.point && parentData.points[0].features.open_sunday"> Otwarte w niedziele</p>
                <p v-if="parentData.point && parentData.points[0].features.parking"> Parking</p>
                <p v-if="parentData.point && parentData.points[0].features.disabled_friendly"> Ułatwienie dla osób niepełnosprawnych</p>
                <p v-if="parentData.point && parentData.points[0].features.cash_on_delivery" > Odbiór za pobraniem</p>
              </div>
            </div>
            <div class="col-2">
              <div class="info-box">
                <div class="logo">
                  <img :src="logosUrl[parentData.pickup_type]" class="img">
                </div>
                <div class="road">
                  <a :href="linkToRoad" target="_blank">Wyznacz trasę dojazdu <i class="play_arrow"/></a>
                </div>
              </div>
              <div class="open-hours" v-if="parentData.point && parentData.points[0].working_hours">
                <div class="hours-title">
                  <p>Godziny otwarcia</p>
                </div>
                <div class="week">
                  <div class="first-half">
                    <p>
                      <template v-for="day in parentData.points[0].working_hours">
                        {{ day }}
                      </template>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
       </div>
       <div class="footer">
         <p class="powrot" @click="closeModal()"><i class="arrow_left"/>POWRÓT</p>
         <p class="zamknij" id="set-point" @click="setPoint(parentData)">Wybierz {{ parentData.pickup_type }} i zamknij</p>
       </div>
    </div>
    <!-- Modal DIV for mobile map -->
    <div class="mobile-map-modal" v-if="isMobile">
      <div class="mobile-map-header">
        <p>Wybrany punky</p>
        <i class="close-icon close-mobile-map-modal" @click="closeModal()"/>
      </div>
      <div class="mobile-map-row">
        <div class="mobile-map-logo">
          <img :src="logosUrl[parentData.pickup_type]" class="img">
        </div>
        <div class="mobile-map-address">
          <h4 class="mobile-map-title">{{ parentData.street }}</h4>
          <p class="mobile-map-street">{{ parentData.zip }} {{ parentData.city }}</p>
          <p v-if="parentData && parentData.points[0].id.length" class="mobile-map-street">{{ parentData.points[0].id }}</p>
        </div>
      </div>
      <div class="mobile-map-hours" v-if="parentData && parentData.points[0].working_hours">
        <div class="mobile-map-hours-title">
          <b>Godziny otwarcia:</b>
        </div>
        <div class="mobile-map-hours-info">
          <p>
            <template v-for="day in parentData.points[0].working_hours">
              {{ day }}
            </template>
          </p>
        </div>
      </div>
      <div class="mobile-map-additional">
        <p v-if="parentData && parentData.points[0].features.open_late" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon hours"/></span> - otwarte do pózna</p>
        <p v-if="parentData && parentData.points[0].features.open_saturday" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon sobota"/></span> - otwarte w soboty</p>
        <p v-if="parentData && parentData.points[0].features.open_sunday" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon niedziela"/></span> - otwarte w niedziele</p>
        <p v-if="parentData && parentData.points[0].features.parking" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon parking"/></span> - parking</p>
        <p v-if="parentData && parentData.points[0].features.disabled_friendly" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon niepelnosprawni"/></span> - ułatwienie dla osób niepełnosprawnych</p>
        <p v-if="parentData && parentData.points[0].features.cash_on_delivery" class="additional-info"><span class="mobile-map-icon-padding"><i class="icon pobraniem"/></span> - odbiór za pobraniem</p>
      </div>
      <div class="mobile-map-footer">
        <p class="mobile-map-btn-close" @click="closeModal">WYBIERZ I ZAMKNIJ</p>
      </div>
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
      logosUrl: {
        'Żabka': require('../../assets/logos/żabka.png'),
        'DPD Pickup': require('../../assets/logos/dpd-pickup.png'),
        'Fresh Market': require('../../assets/logos/freshmarket.png'),
        'In Post': require('../../assets/logos/inpost.png'),
        'Poczta Polska': require('../../assets/logos/pocztapolska.png'),
        'Paczka w Ruchu': require('../../assets/logos/paczka_w_ruchu.jpg'),
        'Orlen': require('../../assets/logos/orlen.png')
      }
    }
  },
  computed: {
    parentData () {
      return this.$store.state.markerDetails
    },
    isWidgetVersion () {
      return this.$store.state.customer.theme
    },
    linkToRoad () {
      let url = 'https://www.google.pl/maps/dir/' + this.$store.state.lat + ',' + this.$store.state.lng + '/' + this.parentData.lat + ',' + this.parentData.lon + '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'
      return url
    }
  },
  methods: {
    setPoint (point) {
      this.sendMessage(point)
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
.arrow_left{
  width: 35px;
  height: 35px;
  display: flex;
  cursor: pointer;
  filter: grayscale(0.5) opacity(0.3);
  background: url('../../assets/icons/arrow_left.png') 0 0 no-repeat;
  background-size: cover;
}
.play_arrow{
  width: 22px;
  height: 22px;
  display: flex;
  cursor: pointer;
  background: url('../../assets/icons/play_arrow.png') 0 0 no-repeat;
  background-size: cover;
}
.mobile-map-modal{
  background: white;
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
      width: 22px;
      height: 22px;
      display: flex;
      cursor: pointer;
      filter: grayscale(0.5) opacity(0.8);
      background: url('../../assets/icons/clear.png') 0 0 no-repeat;
      background-size: cover;
    }
  }
  .mobile-map-row{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
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
      }
    }
  }
  .mobile-map-hours{
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    .mobile-map-hours-info{
      text-align: left;
      font-size: 14px;
    }
  }
  .mobile-map-additional{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    // height: 75px;
    padding: 15px;
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
    color: white;
    background: #E4405F;
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
}
.content{
  background: #F5F5F5;
  padding-bottom: 10px;
}
.modal{
  width: 100%;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  border-radius: 9px;
}
.modalV2{
  display: flex;
  flex-direction: column;
  margin: 20px;
  border: 1px solid #E54C69;
  background-color: white;
  .content{
    background: none;
    padding: 0;
  }
  .title{
    padding-left: 30px;
    h3{
        text-align: left;
        font-size: 22px;
        margin: 10px 0;
        padding: 0;
        @media (max-width: 1000px) {
          font-size: 18px;
        }
    }
  }
  .selected-supplier {
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #E5E5E5;
    margin: 0 30px;
  }
  .col2 {
    flex: 0 0 50%;
  }
  .powrot {
    padding-left: 10px;
  }
  .zamknij {
    margin-right: 25px;
  }
}
.footer{
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  align-items: center;
  background: white;
}
.title{
  padding-left: 20px;
  h3 {
    margin: 0;
    text-align: left;
    padding-top: 10px;
    font-size: 22px;
    color: #000000;
  }
}
.selected-supplier{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.col-1{
  display: flex;
  flex-direction: column;
  align-items: end;
  flex: 0 0 40%;
}
.col-2{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 45%;
}
.info-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .logo{
    display: flex;
  }
  .road{
    display: flex;
    justify-content: center;
    width: 50%;
    a {
      display: flex;
      font-size: 16px;
      color: #000000;
      align-items: center;
      text-decoration: none;
    }
  }
}
.open-hours{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.hours-title{
  width: 100%;
  display: flex;
  p {
    font-size: 16px;
    color: #000000;
    font-weight: 600;
    padding: 10px 0;
  }
}
.week{
  display: flex;
  color: #000000;
}
.first-half {
  padding-right: 20px;
  text-align: left;
}
.second-half{
  text-align:left;
}
.address{
  display: flex;
  flex-direction: column;
  align-items: end;
  padding: 10px 0;
  color: #000000;
  font-size: 16px;
  h4{
    margin: 0;
    font-weight: 900;
  }
}
.shop {
  display: flex;
  flex-direction: column;
  align-items: end;
  font-size: 14px;
  color: #000000;
  text-align: left;
}
.additional{
  opacity: 0.8;
}
.paddbott{
  padding-bottom: 15px;
}
.powrot{
  display: flex;
  height: fit-content;
  font-size: 17px;
  color: #ADADAD;
  align-items: center;
  cursor: pointer;
}
.zamknij{
  background: #E4405F;
  height: 45px;
  display: flex;
  align-items: center;
  border-radius: 9px;
  justify-content: center;
  font-size: 16px;
  color: #FFFFFF;
  padding: 0 15px;
  z-index: 999;
  cursor: pointer;
  margin-right: 10px;
}
@media only screen and (max-width: 1000px) {
 .title h3{
   font-size: 18px;
 }
 .address{
    h4, p {
      font-size: 14px;
    }
 }
 .shop{
   p {
     font-size: 12px;
   }
 }
 .hours-title{
   p {
     font-size: 13px;
   }
 }
 .first-half{
   p{
     font-size: 13px;
   }
 }
 .second-half{
   p{
     font-size: 13px;
   }
 }
 .info-box{
  .road{
    a{
      font-size: 12px;
      i {
        height: 16px;
        width: 16px;
      }
    }
  }
 }
 .img{
   width: 70px;
 }
 .powrot{
   font-size: 15px;
   i {
     font-size: 40px;
   }
 }
 .zamknij{
   font-size: 14px;
   height: 40px;
 }
}
</style>
