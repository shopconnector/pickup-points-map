<template>
  <div>
    <div :class="!isWidgetVersion ? 'modal' : 'modalV2'" v-if="!isMobile">
       <div :class="!isWidgetVersion ? 'content' : 'contentV2'">
          <div :class="!isWidgetVersion ? 'title' : 'titleV2'"><h3>Wybrany sposób dostawy</h3></div>
          <div :class="!isWidgetVersion ? 'selected-supplier' : 'selected-supplierV2'">
            <div class="col-1" :class="{'col1-v2' : isWidgetVersion}">
              <div class="address">
                <h4>{{parentData.address1}}</h4>
                <p>{{parentData.zip}} {{parentData.address2}}</p>
                <p>PL13883</p>
              </div>
              <div class="shop paddbott">
                <p>{{parentData.shop}}</p>
                <p>{{parentData.phone}}</p>
              </div>
              <div class="shop additional">
                <p>Parking</p>
                <p>Odbiór</p>
                <p>Nadanie opłaconej przesyłki</p>
                <p>Nadanie na miejscu + płatność i BZT</p>
              </div>
            </div>
            <div class="col-2" :class="{'col2-v2' : isWidgetVersion}">
              <div class="info-box">
                <div class="logo">
                  <img :src="parentData.icon.iconUrl" :alt="parentData.icon.alt" class="img">
                </div>
                <div class="road">
                  <a :href="'https://www.google.pl/maps/dir//' + parentData.position.lat + ',' + parentData.position.lng + '/@52.2502198,21.0280249 + ,16z/data=!4m2!4m1!3e3?hl=pl'" target="_blank">Wyznacz trasę dojazdu <i class="material-icons">play_arrow</i></a>
                </div>
              </div>
              <div class="open-hours">
                <div class="hours-title">
                  <p>Godziny otwarcia</p>
                </div>
                <div class="week">
                  <div class="first-half">
                    <p>Pon: 06:00-20:00</p>
                    <p>Wt: 06:00-20:00</p>
                    <p>Śr: 06:00-20:00</p>
                  </div>
                  <div class="second-half">
                    <p>Czw: 06:00-20:00</p>
                    <p>Pt: 06:00-20:00</p>
                    <p>Sob: 06:00-20:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
       </div>
       <div class="footer" :class="{'footerV2' : isWidgetVersion}">
         <p class="powrot" @click ="closeModal()" :class="{'powrot-v2' : isWidgetVersion}"><i class="material-icons">arrow_left</i>POWRÓT</p>
         <p class="zamknij" :class="{'zamknij-v2' : isWidgetVersion}">WYBIERZ DPD I ZAMKNIJ</p>
       </div>
    </div>
    <!-- Modal DIV for mobile map -->
    <div class="mobile-map-modal" v-if="isMobile">
      <div class="mobile-map-header">
        <p>Wybrany punky</p>
        <i class="material-icons close-mobile-map-modal" @click="closeModal()">clear</i>
      </div>
      <div class="mobile-map-row">
        <div class="mobile-map-logo">
          <img :src="parentData.icon.iconUrl" :alt="parentData.icon.alt" class="img">
        </div>
        <div class="mobile-map-address">
          <h4 class="mobile-map-title">{{parentData.address1}}</h4>
          <p class="mobile-map-street">{{parentData.zip}} {{parentData.address2}}</p>
          <p class="mobile-map-street">PL13883</p>
        </div>
      </div>
      <div class="mobile-map-hours">
        <div class="mobile-map-hours-title">
          <b>Godziny otwarcia:</b>
        </div>
        <div class="mobile-map-hours-info">
          <p>{{ parentData.openTime }}</p>
          <p>{{ parentData.openTime2 }}</p>
        </div>
      </div>
      <div class="mobile-map-additional">
        <p class="additional-info"><span class="mobile-map-icon-padding"><i class="icon hours"/></span> - otwarte do pózna</p>
        <p class="additional-info"><span class="mobile-map-icon-padding"><i class="icon sobota"/></span> - otwarte w soboty</p>
        <p class="additional-info"><span class="mobile-map-icon-padding"><i class="icon niedziela"/></span> - otwarte w niediele</p>
        <p class="additional-info"><span class="mobile-map-icon-padding"><i class="icon parking"/></span> - parking</p>
      </div>
      <div class="mobile-map-footer">
        <p class="mobile-map-btn-close" @click="closeModal()">WYBIERZ I ZAMKNIJ</p>
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
  props: {
    parentData: Object,
    toogleModal: Boolean
  },
  data () {
    return {
      mutableToogleModal: this.toogleModal,
      logosUrl: {
        zabka: require('../../assets/logos/żabka.png'),
        dpd: require('../../assets/logos/dpd.png'),
        dpdPickup: require('../../assets/logos/dpd-pickup.png'),
        fresh: require('../../assets/logos/freshmarket.png'),
        inpost: require('../../assets/logos/inpost.png'),
        pocztaPolska: require('../../assets/logos/pocztapolska.png')
      }
    }
  },
  computed: {
    isWidgetVersion () {
      return this.$store.state.WidgetVersion
    }
  },
  methods: {
    closeModal () {
      this.mutableToogleModal = false
      this.$emit('close', this.mutableToogleModal)
    }
  }
}
</script>

<style lang="scss" scoped>
//mobile map modal styles
.mobile-map-modal{
  background: white;
  margin: 0 20px;
  border: 1px solid #E4405F;
  .mobile-map-header{
    display: flex;
    justify-content: center;
    padding-top: 10px;
    font-size: 18px;
    font-weight: 700;
    .close-mobile-map-modal{
      position: absolute;
      right: 25px;
      top: 6px;
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
    padding: 15px;
    font-size: 15px;
    .additional-info{
    display: flex;
    align-items: center;
    .mobile-map-icon-padding{
      padding-right: 10px;
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
      .parking{
        background: url('../../assets/parking.png') 0 0 no-repeat;
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

// -----------------------
p {
  padding: 0;
  margin: 0;
}
.img{
  width: 85px;
  // padding-right: 55px;
}
.content{
  background: #F5F5F5;
  padding-bottom: 15px;
}
.modal{
  width: 100%;
  margin-top: 25px;
  // margin-bottom: 65px;
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
}
.footer{
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  align-items: center;
  // position: fixed;
  // bottom: 0;
  // right: 0;
  // left: 0;
  // background: white;
}
.footerV2{
  justify-content: space-between;
}
.title{
  padding-left: 27px;
  h3 {
    margin: 0;
    text-align: left;
    padding-top: 15px;
    font-size: 22px;
    color: #000000;
  }
}
.titleV2{
    padding-left: 30px;
    h3{
        text-align: left;
        font-size: 22px;
        margin: 10px 0;
    }
}
.selected-supplier{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.selected-supplierV2{
   display: flex;
   justify-content: space-between;
   padding-bottom: 15px;
   border-bottom: 1px solid #E5E5E5;
   margin: 0 30px;
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
  flex: 0 0 40%;
}
.col2-v2{
  flex: 0 0 50%;
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
  padding: 15px 0;
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
  i {
    font-size: 45px;
  }
  &:hover{
    color: #E4405F;
  }
}
.powrot-v2{
  // display: none;
  padding-left: 10px;
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
.zamknij-v2{
  margin-right: 25px;
  padding: 0 15px;
}
@media only screen and (max-width: 1000px) {
 .titleV2 h3 {
   font-size: 20px;
 }
 .title h3{
   font-size: 20px;
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
     font-size: 14px;
   }
 }
 .first-half{
   p{
     font-size: 14px;
   }
 }
 .second-half{
   p{
     font-size: 14px;
   }
 }
 .road{
   p{
     font-size: 12px;
     i {
       font-size: 22px;
     }
   }
 }
 .img{
   width: 75px;
  //  padding-right: 40px;
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
