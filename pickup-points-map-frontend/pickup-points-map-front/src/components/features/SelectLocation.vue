<template>
  <div class="location">
    <h1 class="title">Wybierz lokalizację</h1>
    <div class="choose-location">
        <h3 class="my-location">Użyj mojej lokalizacji</h3>
        <p class="lub">lub</p>
        <h3 class="inputs" v-show="myInputs[0]" @click="myInputsControl(0)">Zacznij wpisywać adres</h3>
        <input class="input-tag" v-show="!myInputs[0]" v-model="address" placeholder="Wpisz adres"/>
        <p class="lub">lub</p>
        <h3 class="inputs" v-show="myInputs[1]" @click="myInputsControl(1)">Wpisz kod punktu odbioru</h3>
        <input class="input-tag" v-show="!myInputs[1]" v-model="pointCode" placeholder="Wpisz kod punktu odbioru"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectLocation',
  data () {
    return {
      address: '',
      pointCode: '',
      myInputs: {
        0: true,
        1: true
      }
    }
  },
  methods: {
    myInputsControl (index) {
      for (var i = 0; i < Object.keys(this.myInputs).length; i++) {
        this.myInputs[i] = true
      }
      this.myInputs[index] = !this.myInputs[index]
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-family: 'Lato', sans-serif;
  font-size: 22px;
  font-weight: 900;
  text-align: left;
}
.my-location{
  color: #000000;
  font-size: 18px;
  font-family: 'Lato', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  &:before{
    content: url(../../assets/gps24px.svg);
    padding-right: 10px;
    width: 25px;
    height: 25px;
  }
}
.choose-location{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.lub{
  font-size: 16px;
  font-family: 'Lato', sans-serif;
  color: #AAAAAA;
  margin: 0;
}
.inputs{
  border: 3px solid #E5E5E5;
  height: 40px;
  width: 74%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  &:hover{
    background-color: #E5E5E5;
    color: #AAAAAA;
    cursor: pointer;
  }
}
.input-tag{
  border: 3px solid #E5E5E5;
  height: 38px;
  width: 72%;
  margin: 18px 0;
  padding-left: 15px;
  font-family: 'Lato', sans-serif;
  color: #303030;
  font-size: 16px;
}
input::placeholder{
 color: #AAAAAA;
 font-size: 16px;
 font-family: 'Lato', sans-serif;
}
</style>
