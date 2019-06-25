<template>
  <div>
    <h1 class="title">Wybierz dostawców</h1>
    <div class="suppliers-menu">
      <div class="select-suppliers" v-for="supp in suppliers" :key="supp.id">
        <input class="styled-checkbox" type="checkbox" :id="supp.id" :value="supp.name" v-model="checkedSuppliers">
        <label :for="supp.id"><img :src="getImgUrl(supp.src)" :alt="supp.alt" class="img"></label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectSuppliersV2',
  data () {
    return {
      checkedSuppliers: [],
      suppliers: [{
        id: 1,
        name: 'Poczta Polska',
        src: 'pocztapolska.png',
        alt: 'Poczta Polska img'
      }, {
        id: 2,
        name: 'Kurier DPD',
        src: 'dpd.png',
        alt: 'DPD img'
      }, {
        id: 3,
        name: 'DPD Pickup',
        src: 'dpd-pickup.png',
        alt: 'DPD pickup img'
      }, {
        id: 4,
        name: 'Żabka',
        src: 'żabka.png',
        alt: 'Żabka png'
      }, {
        id: 5,
        name: 'Fresh',
        src: 'freshmarket.png',
        alt: 'Fresh png'
      }, {
        id: 6,
        name: 'Paczkomaty In-Post',
        src: 'inpost.png',
        alt: 'Paczkomaty In-Post img'
      }]
    }
  },
  methods: {
    getImgUrl (pic) {
      return require('../../assets/supp/' + pic)
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  text-align: left;
  font-size: 24px;
  color: #000000;
  font-weight: 900;
  margin: 0;
}
.suppliers-menu{
  display: flex;
  flex-wrap: wrap;
  margin-left: 60px;
}
.select-suppliers{
  display: flex;
  align-items: center;
  flex: 1 0 30%;
  padding: 0 20px 0 0;
}
.img{
  width: 87px;
}
.styled-checkbox{
  position: absolute;
  opacity: 0;
    & + label {
      position: relative;
      cursor: pointer;
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
</style>
