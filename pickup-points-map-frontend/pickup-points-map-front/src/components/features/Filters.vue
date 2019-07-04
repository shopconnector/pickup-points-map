<template>
    <div :class="isWidgetVersion ? 'filters' : 'filtersV2'">
      <div class="suppliers">
        <h1 class="title">Wybierz dostawców</h1>
        <div class="suppliers-menu">
          <div class="selectSuppliers" v-for="supp in suppliers" :key="supp.id">
            <input class="styled-checkbox" type="checkbox" :id="supp.id" :value="supp.name" v-model="checkedSuppliers">
            <label :for="supp.id">{{supp.name}}</label>
          </div>
        </div>
      </div>
      <div class="header">
        <h1 :class="isWidgetVersion ? 'title' : 'titleV2'">Filtry</h1><p :class="isWidgetVersion ? 'subtitle' : 'subtitleV2'" @click="clearFilter()">
            Wyczyść filtry<span :class="isWidgetVersion ? 'clear' : 'clearV2'">X</span></p>
      </div>
      <div class="filters-menu">
        <div class="first-half">
          <!-- 1 checkbox -->
          <div class="checkbox-container">
            <input class="custom-checkbox" :class="{'custom-checkboxV2' : !isWidgetVersion}" type="checkbox" id="otwarteDoPozna" value="openNight" v-model="filters">
            <label class="custom-icon pozna" for="otwarteDoPozna">Otwarte do póżna</label>
          </div>
          <!-- 2 checkbox -->
          <div class="checkbox-container">
            <input class="custom-checkbox" :class="{'custom-checkboxV2' : !isWidgetVersion}" type="checkbox" id="otwarteWSobotu" value="openSat" v-model="filters">
            <label class="custom-icon sobota" for="otwarteWSobotu">Otwarte w soboty</label>
          </div>
          <!-- 3 checkbox -->
          <div class="checkbox-container">
            <input class="custom-checkbox" :class="{'custom-checkboxV2' : !isWidgetVersion}" type="checkbox" id="otwarteWNiedziele" value="openSun" v-model="filters">
            <label class="custom-icon niedziela" for="otwarteWNiedziele">Otwarte w niedziele</label>
          </div>
        </div>
        <div class="second-half">
          <!-- 4 checkbox -->
          <div class="checkbox-container">
            <input class="custom-checkbox" :class="{'custom-checkboxV2' : !isWidgetVersion}" type="checkbox" id="dlaOsobNiepelnosprawnych" value="disabledPeople" v-model="filters">
            <label class="custom-icon niepelnosprawni" for="dlaOsobNiepelnosprawnych">Ułatwienie dla osób niepełnosprawnych</label>
          </div>
          <!-- 5 checkbox -->
          <div class="checkbox-container">
            <input class="custom-checkbox" :class="{'custom-checkboxV2' : !isWidgetVersion}" type="checkbox" id="parking" value="parking" v-model="filters">
            <label class="custom-icon parking" for="parking">Parking</label>
          </div>
          <!-- 6 checkbox -->
          <div class="checkbox-container">
            <input class="custom-checkbox" :class="{'custom-checkboxV2' : !isWidgetVersion}" type="checkbox" id="odbiorZaPobraniem" value="cashOnDelivery" v-model="filters">
            <label class="custom-icon pobraniem" for="odbiorZaPobraniem">Odbiór za pobraniem</label>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Filters',
  data () {
    return {
      checkedSuppliers: [],
      suppliers: [{
        'id': 1,
        'name': 'pocztaPolska'
      }, {
        'id': 2,
        'name': 'dpd'
      }, {
        'id': 3,
        'name': 'dpdPickup'
      }, {
        'id': 4,
        'name': 'zabka'
      }, {
        'id': 5,
        'name': 'fresh'
      }, {
        'id': 6,
        'name': 'inpost'
      }],
      filters: [],
      markers: null
    }
  },
  computed: {
    isWidgetVersion () {
      return this.$store.state.WidgetVersion
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
      this.filters = []
      return this.$store.getters.clearFilters
    }
  }
}
</script>

<style lang='scss' scoped>
.filters{
  margin: 0 20px;
}
.header{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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
  font-size: 22px;
  font-weight: 900;
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
}
.filters-menu{
  display: flex;
}
.first-half{
  flex: 0 0 45%;
}
.second-half{
  flex: 0 0 55%;
}
.custom-checkbox{
  display: none;
  opacity: 0;
  position: relative;
  & +.custom-icon{
    position: relative;
    padding-left: 30px;
    margin: 12px 0;
    width: 70%;
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
  margin: 0 20px;
}
.title{
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
  flex: 0 0 25%;
  padding: 10px 20px 10px 0;
}
.styled-checkbox{
  position: absolute;
  opacity: 0;
    & + label {
      font-family: 'Lato', sans-serif;
      font-size: 16px;
      position: relative;
      cursor: pointer;
      padding: 0;
    }
    & + label:before {
      content: '';
      position: absolute;
      top: 35%;
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

@media only screen and (max-width: 1000px) {
 .title{
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
}
</style>
