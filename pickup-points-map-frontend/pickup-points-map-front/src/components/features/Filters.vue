<template>
    <div class="filters">
      <div class="header">
        <h1 class="title">Filtry</h1><p class="subtitle" @click="clearFilter()">Wyczyść filtry<span class="clear">X</span></p>
      </div>
      <div class="filters-menu">
        <!-- 1 checkbox -->
        <div class="checkbox-container">
          <input class="custom-checkbox" type="checkbox" id="otwarteDoPozna" value="Otwarte do pozna" v-model="filters">
          <label class="custom-icon pozna" for="otwarteDoPozna">Otwarte do póżna</label>
        </div>
        <!-- 2 checkbox -->
        <div class="checkbox-container">
          <input class="custom-checkbox" type="checkbox" id="otwarteWSobotu" value="Otwarte w soboty" v-model="filters">
          <label class="custom-icon sobota" for="otwarteWSobotu">Otwarte w soboty</label>
        </div>
        <!-- 3 checkbox -->
        <div class="checkbox-container">
          <input class="custom-checkbox" type="checkbox" id="otwarteWNiedziele" value="Otwarte w niedziele" v-model="filters">
          <label class="custom-icon niedziela" for="otwarteWNiedziele">Otwarte w niedziele</label>
        </div>
        <!-- 4 checkbox -->
        <div class="checkbox-container">
          <input class="custom-checkbox" type="checkbox" id="dlaOsobNiepelnosprawnych" value="Dla osob niepelnosprawnych" v-model="filters">
          <label class="custom-icon niepelnosprawni" for="dlaOsobNiepelnosprawnych">Ułatwienie dla osób niepełnosprawnych</label>
        </div>
        <!-- 5 checkbox -->
        <div class="checkbox-container">
          <input class="custom-checkbox" type="checkbox" id="parking" value="Parking" v-model="filters">
          <label class="custom-icon parking" for="parking">Parking</label>
        </div>
        <!-- 6 checkbox -->
        <div class="checkbox-container">
          <input class="custom-checkbox" type="checkbox" id="odbiorZaPobraniem" value="Odbior za pobraniem" v-model="filters">
          <label class="custom-icon pobraniem" for="odbiorZaPobraniem">Odbiór za pobraniem</label>
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
  methods: {
    clearFilter () {
      this.filters = []
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title{
  font-size: 22px;
  font-weight: 900;
}
.subtitle{
  margin: 0 12% 0 0;
  font-size: 18px;
  &:hover{
    color: #E5E5E5;
    cursor: pointer;
  }
}
.clear{
  padding: 10px;
}
.checkbox-container{
  width: 100%;
}
.filters-menu{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.custom-checkbox{
  opacity: 0;
  position: relative;
  & +.custom-icon{
    position: relative;
    padding-left: 25px;
    width: 100%;
    display: block;
    text-align: left;
    &:before{
      content: '';
      width: 17px;
      height: 17px;
      position: absolute;
      left: -3px;
    }
   &:after{
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      background-color:#E5E5E5;
      border-radius: 3px;
      top: -20%;
      right: 115px;
   }
 }
  &:checked +.custom-icon:after{
    background-color: #E54C69;
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
