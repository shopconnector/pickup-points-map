<template>
    <div :class="isWidgetVersion ? 'filters' : 'filtersV2'">
      <div class="header">
        <h1 :class="isWidgetVersion ? 'title' : 'titleV2'">Filtry {{openNightFilter}}</h1><p :class="isWidgetVersion ? 'subtitle' : 'subtitleV2'" @click="clearFilter()">
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
      filters: []
    }
  },
  computed: {
    isWidgetVersion () {
      return this.$store.state.WidgetVersion
    },
    openNightFilter () {
      if (this.filters.includes('openNight')) {
        return this.$store.getters.openNightMarkers
        // return this.$store.dispatch('openNightMarkers')
      }
    }
  },
  methods: {
    clearFilter () {
      this.filters = []
    }
    // openNightFilter () {
    //   if (this.filters.includes('openNight')) {
    //     return this.$store.getters.openNightMarkers
    // return this.$store.dispatch('openNightMarkers')
    // }
    // }
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
  align-items: center;
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
    line-height: 20px;
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
</style>
