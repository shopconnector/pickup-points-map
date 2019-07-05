<template>
        <div :class="!isWidgetVersion ? 'modal' : 'modalV2'">
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
              <div class="logo">
                <img :src="parentData.icon.iconUrl" :alt="parentData.icon.alt" class="img">
                <div class="road">
                  <p>Wyznacz trasę dojazdu <i class="material-icons">play_arrow</i></p>
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
</template>

<script>
export default {
  name: 'ModalDiv',
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
p {
  padding: 0;
  margin: 0;
}
.img{
  width: 85px;
  padding-right: 55px;
}
.content{
  background: #F5F5F5;
  padding-bottom: 15px;
}
.modal{
  width: 100%;
  margin: 25px -35px 0px 0px;
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
.logo{
  display: flex;
}
.road{
  display: flex;
  justify-content: center;
  p {
    display: flex;
    font-size: 14px;
    color: #000000;
    align-items: center;
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
   padding-right: 40px;
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
