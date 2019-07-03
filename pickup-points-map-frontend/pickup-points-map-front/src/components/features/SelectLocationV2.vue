<template>
  <div>
    <h1 class="title">Wybierz lokalizację</h1>
    <div class="choose-location">
        <h3 class="my-location">Użyj mojej lokalizacji</h3>
        <p class="lub">lub</p>
        <h3 class="inputs" v-show="myInputs[0]" @click="myInputsControl(0)">Wpisz adres</h3>
        <input  class="input-tag" v-show="!myInputs[0]" @blur="myInputs[0] = true" v-model="address" placeholder="Wpisz adres">
        <p class="lub">lub</p>
        <h3 class="inputs" v-show="myInputs[1]" @click="myInputsControl(1)">Wpisz punkt odbioru</h3>
        <input class="input-tag" v-show="!myInputs[1]" @blur="myInputs[1] = true" v-model="pointCode" placeholder="Wpisz punkt odbioru">
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectLocationV2',
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
  margin: 0;
}
.my-location{
  flex-basis: 30%;
  color: #989898;
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  display: flex;
  justify-content: end;
  align-items: center;
  background-color: #E4E4E4;
  height: 35px;
  border-radius: 9px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  position: relative;
  &:before{
    content: url(../../assets/gps24px.svg);
    padding-right: 10px;
    width: 25px;
    height: 25px;
    filter: opacity(0.4)
  }
  &:hover{
    background-color: #3F87F5;
    color:#FFFFFF;
    cursor: pointer;
  }
}
.choose-location{
  display: flex;
  align-items: center;
}
.lub{
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  color: #989898;
  margin: 0px 20px;
}
.inputs{
  flex-basis: 30%;
  background-color: #E4E4E4;
  border-radius: 9px;
  color: #989898;
  height: 35px;
  display: flex;
  justify-content: end;
  padding-left: 10px;
  align-items: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover{
    background-color: #3F87F5;
    color:#FFFFFF;
    cursor: pointer;
  }
}
.input-tag{
  flex-basis: 30%;
  border: 3px solid #E5E5E5;
  border-radius: 9px;
  height: 29px;
  margin: 14px 0;
  font-family: 'Lato', sans-serif;
  color: #303030;
  font-size: 16px;
  padding-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
input::placeholder{
 color: #AAAAAA;
 font-size: 16px;
 font-family: 'Lato', sans-serif;
}
</style>
