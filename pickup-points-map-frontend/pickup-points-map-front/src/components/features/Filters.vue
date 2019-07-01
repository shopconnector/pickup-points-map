<template>
    <div class="filters">
      <div class="header">
        <h1 class="title">Filtry</h1><p class="subtitle" @click="clearFilter()">Wyczyść filtry<span class="clear">X</span></p>
      </div>
      <div class="filters-menu">
        <div class="first-half">
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
        </div>
        <div class="second-half">
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
.subtitle{
  margin: 0 2% 0 0;
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
  // text-align: left;
  // margin: 15px 0;
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
    // padding-left: 30px;
    // max-width: 50%;
    // margin: 15px 0;
    padding-left: 30px;
    margin: 16px 0;
    width: 100%;
    display: block;
    text-align: left;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
    padding-right: 40px;
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
      right: 0px;
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
