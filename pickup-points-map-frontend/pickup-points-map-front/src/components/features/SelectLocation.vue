<template>
  <div :class="isWidgetVersion ? 'location' : 'locationV2'">
    <div :class="isWidgetVersion ? 'location-header' : 'location-headerV2'">
      <h1 class="title">Wybierz lokalizację</h1>
    </div>
    <div class="choose-location">
        <h3 :class="isWidgetVersion ? 'my-location' : 'my-locationV2'" @click="currentPos()">Użyj mojej lokalizacji</h3>
        <p class="lub">lub</p>
        <vue-autosuggest
            class='input-tag'
            :class="{'input-tagV2' : !isWidgetVersion}"
            :limit="10"
            v-model="locitAddress"
            @input="locitAdres()"
            @selected="logResult"
            :get-suggestion-value="getSuggestionValue"
            :suggestions="[{data:locitSuggestions}]"
            :input-props="{id:'autosuggest__input', placeholder:'Zacznij wpisywać adres'}"
        >
          <template slot-scope="{suggestion}">
            {{ suggestion.item.city + ', ' + suggestion.item.prefix + ' ' + suggestion.item.street + ' ' + suggestion.item.building + ', ' + suggestion.item.zip }}
            <small>({{ suggestion.item.voiv + ' ' + suggestion.item.pov + ' ' + suggestion.item.mun }})</small>
          </template>
        </vue-autosuggest>
        <!-- <span @click="locitAddress = ''"><i class="material-icons clear-input">clear</i></span> -->
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
  computed: {
    isWidgetVersion () {
      return this.$store.state.WidgetVersion
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
.input-tagV2 input{
 font-size: 14px;
 background-color: transparent;
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
.location{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: end;
}
.locationV2{
  display: block;
}
.location-header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.location-headerV2{
  display: block;
}
// .clear-input{
//   padding-left: 5px;
//   color: #b4b1b1;
//   font-size: 35px;
//   cursor: pointer;
//   &:hover{
//     color: black;
//   }
// }

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
  justify-content: center;
}
.my-location{
  flex: 0 0 25%;
  color: #000000;
  font-size: 18px;
  font-family: 'Lato', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 46px;
  margin: 10px 0;
  cursor: pointer;
  &:hover{
    background-color: #E5E5E5;
    border-radius: 3px;
  }
  &:before{
    content: url(../../assets/gps24px.svg);
    padding-right: 10px;
    width: 25px;
    height: 25px;
  }
}
.my-locationV2{
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  position: relative;
  &:before{
    content: url(../../assets/gps24px.svg);
    padding-right: 10px;
    width: 17px;
    height: 25px;
    filter: opacity(0.4)
  }
  &:hover{
    background-color: #3F87F5;
    color:#FFFFFF;
    cursor: pointer;
  }
}
.lub{
  font-size: 16px;
  font-family: 'Lato', sans-serif;
  color: #AAAAAA;
  margin: 0;
  padding: 0 25px;
}
.lubV2{
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  color: #989898;
  margin: 0px 20px;
}
.input-tag{
  position: relative;
  flex: 0 0 40%;
  background-color: #E5E5E5;
  border: 3px solid #E5E5E5;
  border-radius: 3px;
  width: 72%;
  margin: 9px 0;
  padding: 10px;
  font-family: 'Lato', sans-serif;
  color: #303030;
  &:after{
    content: url('../../assets/clear.png');
    position: absolute;
    right: 5px;
    top: 5px;
    filter: opacity(0.4)
  }
}
.input-tagV2{
  flex: 0 0 45%;
  border: 3px solid #E5E5E5;
  background-color: transparent;
  border-radius: 9px;
  margin: 14px 0;
  padding: 6px;
  &::after{
    top: 0;
    right: 0;
  }
}
input::placeholder{
 color: #AAAAAA;
 font-size: 16px;
 font-family: 'Lato', sans-serif;
}

@media only screen and (max-width: 1000px) {
 .title {
   font-size: 20px;
 }
 .my-location{
   font-size: 16px;
 }
 .lub{
   font-size: 14px;
 }
 .lubV2{
   font-size: 13px;
   margin: 0 15px;
 }
}
</style>
