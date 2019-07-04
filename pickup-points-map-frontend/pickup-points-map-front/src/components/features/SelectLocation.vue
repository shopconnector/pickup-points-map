<template>
  <div class="location">
    <div class="location-header">
      <h1 class="title">Wybierz lokalizację</h1>
      <p class="zamknij"><span class="clear">X</span>ZAMKNIJ</p>
    </div>
    <div class="choose-location">
        <h3 class="my-location" @click="currentPos()">Użyj mojej lokalizacji</h3>
        <p class="lub">lub</p>
        <vue-autosuggest
            class="input-tag"
            :limit="10"
            v-model="locitAddress"
            @input="locitAdres()"
            @selected="logResult"
            :get-suggestion-value="getSuggestionValue"
            :suggestions="[{data:locitSuggestions}]"
            :input-props="{id:'autosuggest__input', placeholder:'Zacznij wpisywać adres'}"
        >
          <template slot-scope="{suggestion}">
            {{ suggestion.item.city + ', ' + suggestion.item.prefix + ' ' + suggestion.item.street + ' ' + suggestion.item.building + ' ' + suggestion.item.zip }}
            <small>({{ suggestion.item.voiv + ' ' + suggestion.item.pov + ' ' + suggestion.item.mun }})</small>
          </template>
        </vue-autosuggest>
        <span @click="locitAddress = ''">clear</span>
        <!-- <h3 class="inputs" v-show="myInputs[0]" @click="myInputsControl(0)">Zacznij wpisywać adres</h3>
        <input class="input-tag" v-show="!myInputs[0]" @blur="myInputs[0] = true" v-model="address" placeholder="Wpisz adres"/> -->
        <!-- <p class="lub">lub</p>
        <h3 class="inputs" v-show="myInputs[1]" @click="myInputsControl(1)">Wpisz kod punktu odbioru</h3>
        <input class="input-tag" v-show="!myInputs[1]" @blur="myInputs[1] = true" v-model="pointCode" placeholder="Wpisz kod punktu odbioru"/> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectLocation',
  data () {
    return {
      locitAddress: '',
      limit: 10,
      locitSuggestions: [],
      customSuggestion: [],
      placeHolder: 'Wpisz adres',
      address: '',
      pointCode: '',
      myInputs: {
        0: true,
        1: true
      }
    }
  },
  methods: {
    currentPos () {
      this.$store.commit('updatePosition1', this.$store.state.geolocation)
    },
    getSuggestionValue (suggestion) {
      if (suggestion) {
        const s = suggestion.item
        this.$store.commit('updatePosition', suggestion.item)
        this.customSuggestion = suggestion.item
        return s.city + ', ' + s.prefix + ' ' + s.street + ' ' + s.building
      } else {
        return 'Wybierz punkt z listy'
      }
    },
    logResult (item) {
      if (item) {
        this.placeHolder = item.item.street
      }
    },
    locitAdres () {
      if (this.locitAddress.length >= 3) {
        return this.$http.get('https://locit.eu/webservice/address-autocomplete/v2.2.0/basic/' + this.locitAddress, { params: { format: 'json', charset: 'UTF-8', key: 'bc0cc95a94b26d9f92308b7ed33719bd' } }).then(response => {
          const locit = JSON.parse(response.bodyText)
          this.locitSuggestions = locit.data.address_listing
        }).catch(error => {
          console.log(error)
        })
      }
    },
    myInputsControl (index) {
      for (var i = 0; i < Object.keys(this.myInputs).length; i++) {
        this.myInputs[i] = true
      }
      this.myInputs[index] = !this.myInputs[index]
    }
  }
}
</script>

<style>
.input-tag ul {
  list-style-type: none;
  padding: 0 10px;
  text-align: left;
}
.input-tag ul li {
  padding: 5px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.input-tag input{
 text-align: center;
 background-color: #E5E5E5;
 width: 100%;
 height: 100%;
 border: 0;
 color: black;
 font-size: 16px;
 font-family: 'Lato', sans-serif;
}
.autosuggest__results-container {
  position: absolute;
  background-color: white;
  z-index: 999;
  margin-top: 13px;
  left: 0;
  border-radius: 5px;
  right: 0;
  box-shadow: 0px 7px 18px 0px #d8d8d8;
}
</style>

<style lang="scss" scoped>
.input-tag {
  position: relative;
}
.location{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: end;
}
.location-header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.zamknij{
  display: none;
//   margin: 0;
//   color: #707070;
//   font-size: 14px;
//   cursor: pointer;
//   &:hover{
//     color: #E5E5E5;
//   }
//   .clear{
//     font-size: 16px;
//     padding-right: 10px;
//  }
}

.title{
  font-family: 'Lato', sans-serif;
  font-size: 22px;
  font-weight: 900;
  text-align: left;
  margin: 0;
}
.choose-location{
  display: flex;
  align-items: center;
  width: 100%;
}
.my-location{
  flex: 0 0 43%;
  color: #000000;
  font-size: 18px;
  font-family: 'Lato', sans-serif;
  display: flex;
  justify-content: end;
  align-items: center;
  height: 46px;
  margin: 10px 0;
  cursor: pointer;
  // &:hover{
  //   background-color: #E5E5E5;
  //   border-radius: 3px;
  // }
  &:before{
    content: url(../../assets/gps24px.svg);
    padding-right: 10px;
    width: 25px;
    height: 25px;
  }
}
.lub{
  font-size: 16px;
  font-family: 'Lato', sans-serif;
  color: #AAAAAA;
  margin: 0;
  padding: 0 25px;
}
.inputs{
  margin: 10px 0;
  flex: 0 0 30%;
  border: 3px solid #E5E5E5;
  border-radius: 3px;
  height: 40px;
  width: 74%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  // &:hover{
  //   background-color: #E5E5E5;
  //   color: #AAAAAA;
  //   cursor: pointer;
  // }
}
.input-tag{
  flex: 0 0 43%;
  background-color: #E5E5E5;
  border: 3px solid #E5E5E5;
  border-radius: 3px;
  // height: 38px;
  width: 72%;
  margin: 10px 0;
  padding: 10px;
  // padding-left: 15px;
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
