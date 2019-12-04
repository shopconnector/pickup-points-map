<template>
    <div class='filters add-scroll-filters'>
      <!-- Select suppliers first version -->
      <div class="suppliers" v-if="isWidgetVersion && !isMobile">
        <h2 class="title-supp">Wybierz dostawców</h2>
        <div class="suppliers-menu">
          <div class="selectSuppliers" v-for="(supp, index) in customerSuppliers" :key="index">
            <input class="styled-checkbox" type="checkbox" :id="supp" :value="supp" @click="selectedFilter()" v-model="filters.checkedSuppliers">
            <label :for="supp">{{supp}}</label>
          </div>
        </div>
      </div>
      <!-- Select suppliers second version -->
      <div v-if="!isWidgetVersion || isMobile">
        <div class="header">
          <h2 class="title-dostawcow">Wybierz dostawców</h2><p v-if="filters.checkedSuppliers.length > 0 || filters.features.length > 0" :class="isWidgetVersion ? 'subtitle' : 'subtitleV2'" @click="clearAPIFilter()">
            Wyczyść filtry<span :class="isWidgetVersion ? 'clear' : 'clearV2'">X</span></p>
        </div>
        <div class="suppliers-menu-dostawcow">
          <div class="select-suppliers-dostawcow" v-for="(supp, index) in customerSuppliers" :key="index">
            <input class="styled-checkbox-dostawcow" type="checkbox" :id="supp" :value="supp" @click="selectedFilter()" v-model="filters.checkedSuppliers">
            <label :for="supp">
              <img :src="getImgUrl(suppliersLogosUrl[supp])" :alt="supp" class="img-dostawcow">
            </label>
          </div>
        </div>
      </div>
      <!-- Filters Menu -->
      <div class="header">
        <h2 class="title" :class="{'titleV2' : !isWidgetVersion}">Filtry</h2>
      </div>
      <div class="filters-menu">
        <div class="checkbox-container" v-for="(box, index) in customerFeatures" :key="index">
          <input class="custom-checkbox" :class="{'custom-checkboxV2' : !isWidgetVersion}" type="checkbox" :id="box" :value="box" @click="selectedFilter()" v-model="filters.features">
          <label class="custom-icon" :class="box" :for="box">{{featuresInfo[box]}}</label>
        </div>
      </div>
      <div class="mobile-filters-footer">
        <div class="wyczysc">
          <p class="m0" @click="clearAPIFilter()" v-show="filters.features.length || filters.checkedSuppliers.length" >Wyczyść filtry</p>
        </div>
        <div class="zastosuj">
          <p class="m0" @click="closeFilterMobile">Zastosuj filtry</p>
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
  props: ['innerFilter'],
  data () {
    return {
      homeFilter: this.innerFilter,
      suppliersLogosUrl: {
        'Poczta Polska': 'pocztapolska.png',
        'DPD Pickup': 'dpd-pickup.png',
        'Żabka': 'żabka.png',
        'Fresh Market': 'freshmarket.png',
        'In Post': 'inpost.png',
        'Paczka w RUCHu': 'paczka_w_ruchu.jpg',
        'Orlen': 'orlen.png'
      },
      featuresInfo: {
        'open_late': 'Otwarte do późna',
        'open_saturday': 'Otwarte w soboty',
        'open_sunday': 'Otwarte w niedziele',
        'disabled_friendly': 'Ułatwienie dla osób niepełnosprawnych',
        'parking': 'Parking',
        'cash_on_delivery': 'Odbiór za pobraniem'
      },
      checkboxes: ['open_late', 'open_saturday', 'open_sunday', 'disabled_friendly', 'parking', 'cash_on_delivery'],
      filters: {
        checkedSuppliers: [],
        features: []
      },
      frameData: null
    }
  },
  computed: {
    customerFeatures () {
      if (this.$store.state.customer.providers) {
        let finalFeatures = Array.from(new Set(Object.values(this.$store.state.customer.providers)
          .map((provider) => Object.values(provider)).flat(2)))
        return finalFeatures
      } else {
        return this.checkboxes
      }
    },
    customerSuppliers () {
      if (this.$store.state.customer.providers) {
        let finalList = []
        for (let supplier in this.$store.state.customer.providers) {
          for (let type in this.$store.state.customer.providers[supplier]) {
            if (finalList.indexOf(type) === -1) {
              finalList.push(type)
            }
          }
        }
        return finalList
      } else {
        return this.allSuppliers
      }
    },
    allSuppliers () {
      return Array.from(new Set(Object.values(this.providerToPickupTypeMapping).flat(1)))
    },

    providerToPickupTypeMapping () {
      if (this.$store.state.customer.providers) {
        let allProviders = []
        for (let supplier in this.$store.state.customer.providers) {
          for (let type in this.$store.state.customer.providers[supplier]) {
            if (allProviders.indexOf(type) === -1) {
              allProviders.push(type)
            }
          }
        }
        return allProviders
      }
    },
    customerUrl () {
      return this.$store.state.customer.url
    },
    isWidgetVersion () {
      return this.$store.state.customer.theme
    },
    isFilterMobilOpen () {
      return this.$store.state.isFilterMobilOpen
    }
  },
  watch: {
    innerFilter: {
      deep: true,
      immediate: true,
      handler () {
        if (this.innerFilter) {
          if (this.allSuppliers.indexOf(this.innerFilter) >= 0) {
            if (this.filters.checkedSuppliers.indexOf(this.innerFilter) === -1) {
              // var filter = this.filters.checkedSuppliers.slice()
              // filter.push(this.innerFilter)
              this.filters.checkedSuppliers = [this.innerFilter]
              if (this.$store.state.toogleModal === true) {
                this.$store.commit('closeToogleModal', false)
              }
              var closePopup = document.getElementsByClassName('leaflet-popup-close-button')[0]
              if (closePopup) {
                closePopup.click()
              }
              var n = this.filters.features.length + this.filters.checkedSuppliers.length
              this.$store.commit('howManyFiltersApplies', n)
              return this.selectedFilter()
            }
          }
        }
      }
    }
  },
  methods: {
    selectedFilter () {
      this.$store.commit('newStoreFilters', this.filters)
    },
    clearAPIFilter () {
      this.filters.checkedSuppliers = []
      this.filters.features = []
      return this.$store.getters.clearAPIFilter
    },
    getImgUrl (pic) {
      return require('../../assets/logos/' + pic)
    },
    closeFilterMobile () {
      this.$store.commit('closeFilterMobile')
      this.howManyFiltersApplies()
    },
    howManyFiltersApplies () {
      let countFilters = this.filters.features.length + this.filters.checkedSuppliers.length
      return this.$store.commit('howManyFiltersApplies', countFilters)
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/_variables.scss';

.test-vh {
  height: 100%;
}
.m0 {
  margin: 0;
}
.mobile-filters-footer{
  background-color: $white;
  height: 20px;
  position: absolute;
  bottom: 25px;
  left: 0;
  right: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  @media (min-width: 767px) {
    display: none
  }
  .wyczysc {
    width: 50%;
    align-items: center;
    margin: 0;
    p {
      width: fit-content;
      background: $light-grey;
      color: $color-black;
      margin: 0px auto;
      padding: 5px 10px;
      border-radius: 9px;
      cursor: pointer;
      &:hover{
        background-color: $red;
        color: $white;
      }
    }
  }
  .zastosuj{
    width: 50%;
    align-items: center;
    margin: 0;
    p {
      width: fit-content;
      margin: 0 auto;
      background: $red;
      color: $white;
      border-radius: 9px;
      padding: 5px 10px;
      cursor: pointer;
    }
  }
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
  margin: 0;
}
.subtitle{
  margin: 0 2% 0 0;
  font-size: 18px;
  cursor: pointer;
  background-color: $light-grey;
  padding: 4px 8px;
  border-radius: 12px;
  &:hover{
    background-color: $red;
  }
}
.subtitleV2{
  background-color: $light-grey;
  padding: 0 8px;
  margin: 5px 0;
  border-radius: 12px;
  font-size: 16px;
  color: $second-grey;
  display: flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
  &:hover{
    background-color: $active-blue;
    color: $white;
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
    cursor: pointer;
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
      background-color: $light-grey;
      border-radius: 3px;
      right: 10px;
   }
 }
  &:checked +.custom-icon:after{
    background-color: $red;
  }
}

.custom-checkboxV2{
    & + .custom-icon{
      cursor: pointer;
        &:after{
          content: '';
          position: absolute;
          width: 17px;
          height: 17px;
          right: 15px;
          border: 3px solid $light-grey;
          border-radius: 50%;
          background-color: transparent;
        }
    }
    &:checked + .custom-icon:after{
      background-color: $active-blue;
      box-shadow: inset 0 0px 3px $white, inset 0 0 0 2px $white;
      border-color: $active-blue;
    }
}
.custom-checkbox + .open_late:before{
    background: url('../../assets/icons/ZEGAR.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .open_saturday:before{
    background: url('../../assets/icons/sobota.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .open_sunday:before{
    background: url('../../assets/icons/niedziela.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .disabled_friendly:before{
    background: url('../../assets/icons/niepelnosprawni.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .parking:before{
    background: url('../../assets/icons/parking.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.custom-checkbox + .cash_on_delivery:before{
    background: url('../../assets/icons/za-pobraniem.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.suppliers{
  display: flex;
  flex-direction: column;
}
.title-supp{
  font-family: $main-font;
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
      font-family: $main-font;
      font-size: 16px;
      position: relative;
      padding: 0;
      width: 100px;
      display: flex;
      height: 20px;
      line-height: 16px;
      align-items: center;
      text-align: left;
      cursor: pointer;
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
      box-shadow: inset 0 0px 3px $white, inset 0 0  0 7px $light-grey;
    }
    &:checked + label:before {
      box-shadow: inset 0 0 0 $white, inset 0 0  0 7px #E54C69;
  }
}
.title-dostawcow{
  text-align: left;
  font-size: 22px;
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
      padding-left: 45px;
      cursor: pointer;
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
      border: 3px solid $light-grey;
    }
    &:checked + label:before {
      background-color: $active-blue;
      box-shadow: inset 0 0px 3px $white, inset 0 0 0 2px $white;
      border-color: $active-blue;
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
      box-shadow: inset 0 0px 3px $white, inset 0 0  0 6px $light-grey;
    }
     &:checked + label:before {
      box-shadow: inset 0 0 0 $white, inset 0 0  0 6px #E54C69;
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
.add-scroll-filters{
  height: calc( 100% - 80px );
  overflow: scroll;
  scroll-behavior: smooth;
}
.filters{
   padding: 20px 15px 0 15px;
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
     top: 37px;
     left: -30px;
     border: 2px solid $light-grey;
   }
   &:checked + label:before{
     background-color: $red;
     box-shadow: inset 0 0px 3px $white, inset 0 0 0 3px $white;
     border-color: $red;
   }
 }
 .select-suppliers-dostawcow{
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
   }
 }
 .custom-checkboxV2{
   & + .custom-icon:after{
     border: 2px solid $light-grey;
     width: 17px;
     height: 17px;
   }
   &:checked + .custom-icon:after{
    background-color: $red;
    box-shadow: inset 0 0px 3px $white, inset 0 0 0 3px $white;
    border-color: $red;
   }
 }
}
</style>
