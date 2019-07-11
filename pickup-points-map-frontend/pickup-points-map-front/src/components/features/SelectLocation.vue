<template>
  <div :class="isWidgetVersion ? 'location' : 'locationV2'">
    <div :class="isWidgetVersion ? 'location-header' : 'location-headerV2'" v-if="!isMobile">
      <h1 class="title">Wybierz lokalizację</h1>
    </div>
    <div class="choose-location" v-if="!isMobile">
        <h3 :class="isWidgetVersion ? 'my-location' : 'my-locationV2'" @click="currentPos()">Użyj mojej lokalizacji</h3>
        <p class="lub">lub</p>
        <div style="position: relative; display: block; width: 72%; flex: 0 0 40%;">
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
        <span class="span-location" @click="locitAddress = ''"><i class="material-icons clear-input">clear</i></span>
        </div>
    </div>
    <vue-over-body :dim="false" :open="IsFooterModalOpen" before="beforeFooterModal" after="afterFooterModal" :transition="0.3">
      <div class="footer-box">
        <!-- v-closable="{ exclude: [], handler: 'closeFooterModal'}" -->
        <h3 class="my-location" @click="currentPos()">Użyj mojej lokalizacji</h3>
        <div class='input-modal-button' :class="{ 'active' : suggestionText }" @click="openLocitModal()">
          <template v-if="suggestionText">{{ suggestionText.city + ', ' + suggestionText.prefix + ' ' + suggestionText.street + ' ' + suggestionText.building }}</template>
          <template v-else>Zacznij wpisywać adres</template>
        </div>
        <div class='input-modal-button'>Wpisz kod odbioru</div>
      </div>
    </vue-over-body>
    <vue-over-body :dim="false" :open="IsLocitModalOpen" before="beforeLocitModal" after="afterLocitModal" :transition="0.3">
      <div class="locit-box">
        <i class="close-button" @click="closeLocitModal()"/>
        <vue-autosuggest
            class='input-tag'
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
        <span class="span-location" @click="locitAddress = ''"><i class="material-icons clear-input">clear</i></span>
      </div>
    </vue-over-body>
  </div>
</template>

<script>
import vueOverBody from 'vue-over-body'
import { MobileDetected } from '../../components/mobileDetected.ts'
// import Vue from 'vue'

// let handleOutsideClick
// Vue.directive('closable', {
//   bind (el, binding, vnode) {
//     handleOutsideClick = (e) => {
//       e.stopPropagation()
//       const { handler, exclude } = binding.value
//       let clickedOnExcludedEl = false
//       exclude.forEach(refName => {
//         if (!clickedOnExcludedEl) {
//           const excludedEl = vnode.context.$refs[refName]
//           clickedOnExcludedEl = excludedEl.contains(e.target)
//         }
//       })
//       if (!el.contains(e.target) && !clickedOnExcludedEl) {
//         vnode.context[handler]()
//       }
//     }
//     document.addEventListener('click', handleOutsideClick)
//     document.addEventListener('touchstart', handleOutsideClick)
//   },
//   unbind () {
//     document.removeEventListener('click', handleOutsideClick)
//     document.removeEventListener('touchstart', handleOutsideClick)
//   }
// })

export default {
  name: 'SelectLocation',
  mixins: [MobileDetected],
  components: {
    vueOverBody
  },
  data () {
    return {
      locitAddress: '',
      suggestionText: '',
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
    },
    IsFooterModalOpen () {
      return this.$store.state.isFooterModalOpen
    },
    IsLocitModalOpen () {
      return this.$store.state.isLocitModalOpen
    }
  },
  methods: {
    openLocitModal () {
      this.$store.commit('openLocitModal')
    },
    closeLocitModal () {
      this.$store.commit('closeLocitModal')
    },
    closeFooterModal () {
      this.$store.commit('closeFooterModal')
    },
    currentPos () {
      this.$store.commit('updatePosition', [{ lat: this.$store.state.geolocation.lat, lng: this.$store.state.geolocation.lng, zoom: 16 }])
      if (this.IsFooterModalOpen) {
        this.closeFooterModal()
      }
    },
    getSuggestionValue (suggestion) {
      if (suggestion) {
        this.suggestionText = suggestion.item
        this.$store.commit('updatePosition', [{ lat: suggestion.item.y, lng: suggestion.item.x, zoom: 16 }])
        this.customSuggestion = suggestion.item
        return this.suggestionText.city + ', ' + this.suggestionText.prefix + ' ' + this.suggestionText.street + ' ' + this.suggestionText.building
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

<style lang="scss">
.beforeLocitModal {
  top: 0;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  width: 100%;
  height: 100vh;
  background-color: #F5F5F5;
  position: absolute;
}
.afterLocitModal {
  opacity: 1;
}
.beforeFooterModal {
  bottom: -100vh;
  width: 100%;
  height: 165px;
  margin-top: calc( 100vh - 165px );
  background-color: white;
  position:absolute;
}
.afterFooterModal {
  bottom: 0;
}
.over_body_mask {
 z-index: 1001 !important;
 overflow-y: hidden !important;
}
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
  @media (max-width: 767px) {
    padding: 10px 0;
  }
}
.input-tag {
 input {
    height: 40px;
    text-align: center;
    background-color: #E5E5E5;
    width: 100%;
    padding: 0 35px 0 0;
    border: 0;
    color: black;
    font-size: 16px;
    font-family: 'Lato', sans-serif;
    @media (max-width: 767px) {
      font-weight: bold;
      border-radius: 5px;
      // padding:  0;
    }
 }
}
.input-tagV2 input{
 padding-right: 25px;
//  font-weight: bold;
 height: 29px;
 border: none;
 font-size: 14px;
 background-color: transparent;
}
.autosuggest__results-container {
  position: absolute;
  background-color: white;
  z-index: 999;
  margin-top: 32px;
  left: 0;
  border-radius: 5px;
  right: 0;
  box-shadow: 0px 7px 18px 0px #d8d8d8;
  cursor: pointer;
  @media (max-width: 767px) {
    box-shadow: none;
    border-radius: 0px;
    background-color: #F5F5F5;
    max-height: calc( 100vh - 200px );
    overflow-y: scroll;
    margin-top: 40px;
  }
}
</style>

<style lang="scss" scoped>
.span-location{
  position: absolute;
  right: 5px;
  top: 18px;
}
.locit-box {
  .close-button {
    margin: 0 auto;
    cursor: pointer;
    background-color: white;
    width: 40px;
    height: 40px;
    right: 10px;
    top: 10px;
    position: absolute;
    background: url('../../assets/clear.png') 0 0 no-repeat;
    background-size: cover;
  }
  .span-location {
    right: 50px;
    top: 64px;
  }
  padding: 50px 40px 0;
  position: relative;
}
.footer-box {
  display: flex;
  align-items: center;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 40px;
}
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
.clear-input{
  color: #b4b1b1;
  font-size: 30px;
  cursor: pointer;
  // &:hover{
  //   color: black;
  // }
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
    content: '';
    background: url('../../assets/gps24px.svg') 0 0 no-repeat;
    background-size: cover;
    margin-right: 10px;
    width: 25px;
    height: 25px;
    @media (max-width: 767px) {
      width: 40px;
      height: 40px;
    }
  }
  @media (max-width: 767px) {
    margin: 10px 0 0 0;
    width: 100%;
  }
}
.my-locationV2{
  flex-basis: 30%;
  padding-left: 25px;
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
    position: absolute;
    left: 5px;
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
.input-tag{
  position: relative;
  display: flex;
  // flex: 0 0 40%;
  background-color: #E5E5E5;
  border: 3px solid #E5E5E5;
  border-radius: 3px;
  margin: 9px 0;
  padding: 0px;
  font-family: 'Lato', sans-serif;
  color: #303030;
  @media (max-width: 767px) {
    width: auto;
    border: 0px;
    padding: 0px;
  }
}
.input-modal-button {
  &.active {
    background-color: #e54c69;
    color: white;
  }
  margin: 10px 0 0 0;
  padding: 10px 0;
  width: 100%;
  flex: 0 0 auto;
  border: 0;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  background-color: #e5e5e5;
  color: #AAAAAA;
  font-family: 'Lato', sans-serif;
  @media (max-width: 767px) {
  }
}
.input-tagV2{
  display: flex;
  flex: 0 0 45%;
  border: 3px solid #E5E5E5;
  background-color: transparent;
  border-radius: 9px;
  margin: 14px 0;
  padding: 0px;
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
}
</style>
