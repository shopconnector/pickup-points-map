<template>
    <div class='filters'>
      <!-- Select suppliers first version -->
      <div class="suppliers" v-if="isWidgetVersion && !isMobile">
        <h1 class="title-supp">Wybierz dostawców</h1>
        <div class="suppliers-menu">
          <div class="selectSuppliers" v-for="supp in suppliers" :key="supp.id">
            <input class="styled-checkbox" type="checkbox" :id="supp.id" :value="supp.value" v-model="checkedSuppliers">
            <label :for="supp.id">{{supp.name}}</label>
          </div>
        </div>
      </div>
      <!-- Select suppliers second version -->
      <div v-if="!isWidgetVersion || isMobile">
        <h1 class="title-dostawcow">Wybierz dostawców</h1>
        <div class="suppliers-menu-dostawcow">
          <div class="select-suppliers-dostawcow" v-for="supp in suppliers" :key="supp.id">
            <input class="styled-checkbox-dostawcow" type="checkbox" :id="supp.id" :value="supp.value" v-model="checkedSuppliers">
            <label :for="supp.id"><img :src="getImgUrl(supp.src)" :alt="supp.alt" class="img-dostawcow"></label>
          </div>
        </div>
      </div>
      <!-- Filters Menu -->
      <div class="header">
        <h1 class="title" :class="{'titleV2' : !isWidgetVersion}">Filtry</h1><p :class="isWidgetVersion ? 'subtitle' : 'subtitleV2'" @click="clearFilter()">
            Wyczyść filtry<span :class="isWidgetVersion ? 'clear' : 'clearV2'">X</span></p>
      </div>
      <div class="filters-menu">
        <div class="checkbox-container" v-for="box in checkboxes" :key="box.id">
          <input class="custom-checkbox" :class="{'custom-checkboxV2' : !isWidgetVersion}" type="checkbox" :id="box.id" :value="box.value" v-model="filters">
          <label class="custom-icon" :class="box.icon" :for="box.id">{{box.info}}</label>
        </div>
      </div>
      <!-- Mobile version -->
      <div class="visible-xs">
        <div class="mobile-filters-footer">
          <p class="wyczysc" @click="clearFilter()">Wyczyść filtry</p>
          <p class="zastosuj" @click="closeFilterMobile">Zastosuj filtry</p>
        </div>
      </div>
  </div>
</template>

<script>
import { MobileDetected } from '../mobileDetected.ts'

export default {
  name: 'Filters',
  components: {
  },
  mixins: [MobileDetected],
  data () {
    return {
      checkedSuppliers: [],
      suppliers: [{
        id: 'Poczta Polska',
        value: 'pocztaPolska',
        name: 'Poczta Polska',
        src: 'pocztapolska.png',
        alt: 'Poczta Polska img'
      }, {
        id: 'Kurier DPD',
        value: 'dpd',
        name: 'Kurier DPD',
        src: 'dpd.png',
        alt: 'DPD img'
      }, {
        id: 'DPD Pickup',
        value: 'dpdPickup',
        name: 'DPD Pickup',
        src: 'dpd-pickup.png',
        alt: 'DPD pickup img'
      }, {
        id: 'Zabka',
        value: 'zabka',
        name: 'Żabka',
        src: 'żabka.png',
        alt: 'Żabka png'
      }, {
        id: 'Fresh',
        value: 'fresh',
        name: 'Fresh',
        src: 'freshmarket.png',
        alt: 'Fresh png'
      }, {
        id: 'Paczkomaty In-post',
        value: 'inpost',
        name: 'Paczkomaty In-Post',
        src: 'inpost.png',
        alt: 'Paczkomaty In-Post img'
      }],
      checkboxes: [{
        id: 'otwarteDoPozna',
        value: 'openNight',
        info: 'Otwarte do póżna',
        icon: 'pozna'
      }, {
        id: 'otwarteWSobotu',
        value: 'openSat',
        info: 'Otwarte w soboty',
        icon: 'sobota'
      }, {
        id: 'otwarteWNiedziele',
        value: 'openSun',
        info: 'Otwarte w niedziele',
        icon: 'niedziela'
      }, {
        id: 'dlaOsobNiepelnosprawnych',
        value: 'disabledPeople',
        info: 'Ułatwienie dla osób niepełnosprawnych',
        icon: 'niepelnosprawni'
      }, {
        id: 'parking',
        value: 'parking',
        info: 'Parking',
        icon: 'parking'
      }, {
        id: 'odbiorZaPobraniem',
        value: 'cashOnDelivery',
        info: 'Odbiór za pobraniem',
        icon: 'pobraniem'
      }],
      filters: [],
      markers: null
    }
  },
  computed: {
    isWidgetVersion () {
      return this.$store.state.WidgetVersion
    },
    isFilterMobilOpen () {
      return this.$store.state.isFilterMobilOpen
    },
    activeFilter () {
      if (this.filters.length > 0 || this.checkedSuppliers.length > 0) {
        return this.$store.getters.filterMarkers(this.filters, this.checkedSuppliers)
      } else if (this.filters.length === 0) {
        return this.$store.getters.clearFilters
      }
    }
  },

  watch: {
    activeFilter (val) {
    }
  },

  created () {
    this.markers = this.$store.state.markers
  },

  methods: {
    clearFilter () {
      this.checkedSuppliers = []
      this.filters = []
      return this.$store.getters.clearFilters
    },
    getImgUrl (pic) {
      return require('../../assets/logos/' + pic)
    },
    closeFilterMobile () {
      this.$store.commit('closeFilterMobile')
      this.howManyFiltersApplies()
    },
    howManyFiltersApplies () {
      let countFilters = this.filters.length + this.checkedSuppliers.length
      return this.$store.commit('howManyFiltersApplies', countFilters)
    }
  }
}
</script>

<style lang='scss' scoped>
.mobile-filters-footer{
  p {
    margin: 0;
    font-size: 16px;
    bottom: 20px;
    position: absolute;
    color: #000000;
  }
  .zastosuj{
    right: 35px;
    color: #E54C69;
  }
}
.filters{
  margin: 0 20px;
}
.header{
  display: flex;
  justify-content: space-between;
  margin: 7px 0;
}
.headerV2{
  align-items: baseline;
}
.title{
  margin: 14px 0 0 0;
  font-size: 22px;
  font-weight: 900;
}
.titleV2{
  color: #000000;
  margin: 0;
}
.subtitle{
  margin: 0 2% 0 0;
  font-size: 18px;
  &:hover{
    color: #E5E5E5;
    cursor: pointer;
  }
}
.subtitleV2{
  font-size: 16px;
  color: #000000;
  display: flex;
  align-items: center;
  margin: 0;
  &:hover{
    color: #989898;
    cursor: pointer;
  }
}
.clear{
  padding: 10px;
}
.clearV2{
  padding: 5px;
}
.checkbox-container{
  display: flex;
  width: 50%;
}
.filters-menu{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 135px;
}
.custom-checkbox{
  display: none;
  opacity: 0;
  position: relative;
  & +.custom-icon{
    position: relative;
    padding-left: 30px;
    margin: 12px 0;
    width: 65%;
    display: flex;
    text-align: left;
    line-height: 16px;
    height: 20px;
    padding-right: 40px;
    align-items: center;
    &:before{
      content: '';
      width: 17px;
      height: 17px;
      position: absolute;
      left: 0;
    }
   &:after{
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      background-color:#E5E5E5;
      border-radius: 3px;
      right: 10px;
   }
 }
  &:checked +.custom-icon:after{
    background-color: #E54C69;
  }
}

.custom-checkboxV2{
    & + .custom-icon{
        &:after{
          content: '';
          position: absolute;
          width: 17px;
          height: 17px;
          right: 15px;
          border: 3px solid #E4E4E4;
          border-radius: 50%;
          background-color: transparent;
        }
    }
    &:checked + .custom-icon:after{
      background-color: #3F87F5;
      box-shadow: inset 0 0px 3px #FFFFFF, inset 0 0 0 2px #FFFFFF;
      border-color:  #3F87F5;
    }
}
.custom-checkbox + .pozna:before{
    background: url('../../assets/ZEGAR.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .sobota:before{
    background: url('../../assets/sobota.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .niedziela:before{
    background: url('../../assets/niedziela.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .niepelnosprawni:before{
    background: url('../../assets/niepelnosprawni.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .parking:before{
    background: url('../../assets/parking.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .pobraniem:before{
    background: url('../../assets/za-pobraniem.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.suppliers{
  display: flex;
  flex-direction: column;
}
.title-supp{
  font-family: 'Lato', sans-serif;
  font-size: 22px;
  font-weight: 900;
  text-align: left;
  margin-top: 0;
}
.suppliers-menu{
  display: flex;
  flex-wrap: wrap;
}
.selectSuppliers{
  display: flex;
  justify-content: end;
  flex: 0 0 30%;
  padding: 10px 20px 10px 0;
  align-items: center;
}
.styled-checkbox{
  position: absolute;
  display: none;
    & + label {
      font-family: 'Lato', sans-serif;
      font-size: 16px;
      position: relative;
      padding: 0;
      width: 100px;
      display: flex;
      height: 20px;
      line-height: 16px;
      align-items: center;
    }
    & + label:before {
      content: '';
      position: absolute;
      top: 45%;
      left: 110%;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      margin: -15px 0 0;
      box-shadow: inset 0 0px 3px #FFFFFF, inset 0 0  0 7px #E5E5E5;
    }
    &:checked + label:before {
      box-shadow: inset 0 0 0 #FFFFFF, inset 0 0  0 7px #E54C69;
  }
}
.title-dostawcow{
  text-align: left;
  font-size: 22px;
  color: #000000;
  font-weight: 900;
  margin: 5px 0;
}
.suppliers-menu-dostawcow{
  display: flex;
  flex-wrap: wrap;
}
.select-suppliers-dostawcow{
  display: flex;
  align-items: center;
  flex: 1 0 30%;
}
.img-dostawcow{
  width: 70px;
}
.styled-checkbox-dostawcow{
  position: absolute;
  opacity: 0;
    & + label {
      position: relative;
      padding-left: 45px
    }
    & + label:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      border-radius: 50%;
      width: 17px;
      height: 17px;
      margin: -15px 0 0;
      border: 3px solid #E4E4E4;
    }
    &:checked + label:before {
      background-color: #3F87F5;
      box-shadow: inset 0 0px 3px #FFFFFF, inset 0 0 0 2px #FFFFFF;
      border-color: #3F87F5;
    }
}
@media only screen and (max-width: 1000px) {
 .title{
   font-size: 20px;
 }
 .title-supp{
   font-size: 20px;
 }
 .titleV2{
   font-size: 20px
 }
 .subtitle{
   font-size: 16px;
 }
 .subtitleV2{
   font-size: 14px;
 }
 .custom-checkbox{
   & + .custom-icon{
     font-size: 14px;
      &:after{
        width: 25px;
        height: 25px;
      }
   }
 }
 .custom-checkboxV2{
   & + .custom-icon{
     font-size: 14px;
      &:after{
        width: 15px;
        height: 15px;
      }
   }
  }
  .styled-checkbox{
    & + label {
      font-size: 14px;
    }
    & + label:before {
      width: 25px;
      height: 25px;
      top: 60%;
      box-shadow: inset 0 0px 3px #FFFFFF, inset 0 0  0 6px #E5E5E5;
    }
     &:checked + label:before {
      box-shadow: inset 0 0 0 #FFFFFF, inset 0 0  0 6px #E54C69;
   }
  }
  .title-dostawcow{
  font-size: 20px;
  }
  .img-dostawcow {
  width: 65px;
  }
 }
 @media only screen and (max-width: 850px) {
 .styled-checkbox{
   & + label {
     width: 80px;
   }
  }
 }

 // Styles for mobile
@media (max-width: 767px) {
.filters{
   padding: 30px 35px 0 35px;
   margin: 0;
 }
 .title-dostawcow{
   font-size:  16px;
   margin: 0;
 }
 .styled-checkbox-dostawcow{
   & + label{
     padding: 0
   }
   & + label:before {
     top: -12px;
     left: 20px;
     border: 2px solid #E4E4E4;
   }
   &:checked + label:before{
     background-color: #E54C69;
     box-shadow: inset 0 0px 3px #FFFFFF, inset 0 0 0 3px #FFFFFF;
     border-color: #E54C69;
   }
 }
 .select-suppliers-dostawcow{
   padding-top: 35px;
   justify-content: center;
 }
 .title{
   font-size: 16px;
 }
 .subtitle, .subtitleV2 {
   display: none;
 }
 .filters-menu{
   flex-wrap: nowrap;
   height: auto;
 }
 .checkbox-container{
   width: 100%;
 }
 .custom-checkbox{
   & + .custom-icon{
     width: 100%;
     color: #000000;
   }
 }
 .custom-checkboxV2{
   & + .custom-icon:after{
     border: 2px solid #E4E4E4;
     width: 17px;
     height: 17px;
   }
   &:checked + .custom-icon:after{
    background-color: #E54C69;
    box-shadow: inset 0 0px 3px #FFFFFF, inset 0 0 0 3px #FFFFFF;
    border-color: #E54C69;
   }
 }
 .custom-checkbox{
    & + .custom-icon{
        &:after{
          content: '';
          position: absolute;
          width: 17px;
          height: 17px;
          right: 15px;
          border: 2px solid #E4E4E4;
          border-radius: 50%;
          background-color: transparent;
        }
    }
    &:checked + .custom-icon:after{
        background-color: #E54C69;
        box-shadow: inset 0 0px 3px #FFFFFF, inset 0 0 0 3px #FFFFFF;
        border-color: #E54C69;
    }
 }
}
</style>
