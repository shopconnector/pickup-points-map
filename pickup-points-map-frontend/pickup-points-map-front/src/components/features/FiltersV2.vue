<template>
    <div class="filters">
      <div class="header">
        <h1 class="title">Filtry</h1><p class="subtitle" @click="clearFilter()"><i class="material-icons clear">clear</i>Wyczyść filtry</p>
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
  name: 'FiltersV2',
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
  color: #000000;
  margin: 0;
}
.subtitle{
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
  padding-right: 5px;
}
.checkbox-container{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
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
    margin-left: 25px;
    width: 90%;
    display: block;
    text-align: left;
    color:#000000;
    &:before{
      content: '';
      width: 17px;
      height: 17px;
      position: absolute;
      left: -25px;
    }
   &:after{
      content: '';
      position: absolute;
      width: 17px;
      height: 17px;
      right: 6px;
      border: 3px solid #E4E4E4;
      border-radius: 50%;
   }
 }
  &:checked +.custom-icon:after{
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
