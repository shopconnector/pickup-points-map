<template>
  <div class="suppliers">
    <h1 class="title">Wybierz dostawców</h1>
    <div class="suppliers-menu">
      <div class="selectSuppliers" v-for="supp in suppliers" :key="supp.id">
        <input class="styled-checkbox" type="checkbox" :id="supp.id" :value="supp.name" v-model="checkedSuppliers">
        <label :for="supp.id">{{supp.name}}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Suppliers',
  data () {
    return {
      checkedSuppliers: [],
      suppliers: [{
        'id': 1,
        'name': 'Poczta Polska'
      }, {
        'id': 2,
        'name': 'Kurier DPD'
      }, {
        'id': 3,
        'name': 'DPD Pickup'
      }, {
        'id': 4,
        'name': 'Żabka'
      }, {
        'id': 5,
        'name': 'Fresh'
      }, {
        'id': 6,
        'name': 'Paczkomaty In-Post'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-family: 'Lato', sans-serif;
  font-size: 24px;
  font-weight: 900;
  text-align: left;
}
.suppliers-menu{
  display: flex;
  flex-wrap: wrap;
}
.selectSuppliers{
  flex: 1 0 30%;
  padding: 10px 20px 10px 0;
  //margin-left: 80px;
  // &:first-child{
  //   margin: 0;
  // }
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
      top: 50%;
      left: 110%;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      margin: -15px 0 0;
      box-shadow: inset 0 0px 3px #FFFFFF, inset 0 0  0 7px #E5E5E5;
    }
    &:checked + label:before {
      box-shadow: inset 0 0px 3px #FFFFFF, inset 0 0  0 7px #E54C69;
    }
}
</style>
