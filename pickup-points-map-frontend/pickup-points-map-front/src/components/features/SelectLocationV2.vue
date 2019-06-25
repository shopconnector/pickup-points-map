<template>
  <div>
    <h1 class="title">Wybierz lokalizację</h1>
    <div class="choose-location">
        <h3 class="my-location">Użyj mojej lokalizacji</h3>
        <p class="lub">lub</p>
        <h3 class="inputs" v-show="myInputs[0]" @click="myInputsControl(0)">Wpisz adres</h3>
        <input class="input-tag" v-show="!myInputs[0]" v-model="address" placeholder="Wpisz adres"/>
        <p class="lub">lub</p>
        <h3 class="inputs third" v-show="myInputs[1]" @click="myInputsControl(1)">Wpisz punkt odbioru</h3>
        <input class="input-tag third-tag" v-show="!myInputs[1]" v-model="pointCode" placeholder="Wpisz punkt odbioru"/>
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
  font-size: 24px;
  font-weight: 900;
  text-align: left;
  margin: 0 0 15px 0;
}
.my-location{
  flex-basis: 30%;
  color: #989898;
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #E4E4E4;
  height: 35px;
  border-radius: 9px;
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
  margin-left: 15px;
}
.lub{
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  color: #989898;
  margin: 0px 20px;
}
.inputs{
  flex-basis: 40%;
  background-color: #E4E4E4;
  border-radius: 9px;
  color: #989898;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  &:hover{
    background-color: #3F87F5;
    color:#FFFFFF;
    cursor: pointer;
  }
}
.input-tag{
  flex-basis: 50%;
  border: 3px solid #E5E5E5;
  border-radius: 9px;
  height: 29px;
  margin: 18px 0;
  padding: 0 0 0 15px;
  font-family: 'Lato', sans-serif;
  color: #303030;
  font-size: 16px;
}
input::placeholder{
 color: #AAAAAA;
 font-size: 16px;
 font-family: 'Lato', sans-serif;
}
.third{
    flex-basis: 30%;
}
.third-tag{
    flex-basis: 20%;
}
</style>
