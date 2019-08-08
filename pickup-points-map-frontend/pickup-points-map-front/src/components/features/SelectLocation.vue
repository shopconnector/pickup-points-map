<template>
  <div :class="isWidgetVersion ? 'location' : 'locationV2'">
    <div :class="isWidgetVersion ? 'location-header' : 'location-headerV2'" v-if="!isMobile">
      <h2 class="title">Wybierz lokalizację</h2>
    </div>
    <div class="choose-location" v-if="!isMobile">
        <h3 :class="[ isWidgetVersion ? 'my-location' : 'my-locationV2', $store.state.geolocation.lat ? 'active' : '']" @click="currentPos()">Moja lokalizacja</h3>
        <p class="lub">lub</p>
        <div class="suggest-box">
          <!-- :class="{ 'active-input' : isInputAddress}" -->
        <vue-autosuggest
            class='input-tag'
            :class="{'input-tagV2' : !isWidgetVersion}"
            :limit="10"
            v-model="locitAddress"
            @input="locitAdres()"
            @selected="logResult"
            @focus="isInputAddress = true"
            @blur="isInputAddress = false"
            :get-suggestion-value="getSuggestionValue"
            :suggestions="[{data:locitSuggestions}]"
            :input-props="{id:'autosuggest__input', placeholder:'Zacznij wpisywać adres'}"
        >
          <template slot-scope="{suggestion}">
            {{ suggestion.item.city + ', ' + suggestion.item.prefix + ' ' + suggestion.item.street + ' ' + suggestion.item.building + ', ' + suggestion.item.zip }}
            <small>({{ suggestion.item.voiv + ' ' + suggestion.item.pov + ' ' + suggestion.item.mun }})</small>
          </template>
        </vue-autosuggest>
        <span class="span-location" :class="{'span-locationV2' : isWidgetVersion}" @click="locitAddress = ''"><i class="clear-input"/></span>
        </div>
        <!--Wpisz kod odbioru -->
        <!-- <p class="lub">lub</p>
        <div class="suggest-box-punkt">
        <vue-autosuggest
            class='input-tag'
            :class="{'input-tagV2' : !isWidgetVersion}"
            :limit="10"
            v-model="kodOdbioru"
            @input="kodOdbioruMethod()"
            @selected="logKodResult"
            :get-suggestion-value="getSuggestionCode"
            :suggestions="[{data:autocompleteList}]"
            :input-props="{id:'autosuggest__input', placeholder:'Podaj kod odbioru'}"
        >
          <template slot-scope="{suggestion}">
            {{ suggestion.item }}
          </template>
        </vue-autosuggest>
        <span class="span-location" :class="{'span-locationV2' : isWidgetVersion}" @click="clearKodObioru()"><i class="clear-input"/></span>
        </div> -->
    </div>
    <vue-over-body v-if="isMobile" :dim="false" :open="IsFooterModalOpen" before="beforeFooterModal" after="afterFooterModal" :transition="0.3">
      <div class="footer-box">
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
        <span class="span-location" @click="locitAddress = ''"><i class="clear-input"/></span>
      </div>
    </vue-over-body>
  </div>
</template>

<script>
import vueOverBody from 'vue-over-body'
import { MobileDetected } from '../../components/mobileDetected.ts'
import EventBus from '../../event-bus'

export default {
  name: 'SelectLocation',
  mixins: [MobileDetected],
  components: {
    vueOverBody
  },
  data () {
    return {
      isInputAddress: false,
      kodOdbioru: '',
      locitAddress: '',
      suggestionText: '',
      suggestionCode: '',
      limit: 10,
      locitSuggestions: [],
      customSuggestion: [],
      placeHolder: 'Wpisz adres',
      placeHolderCode: 'Podaj kod odboiru',
      address: ''
    }
  },
  beforeMount () {
    window.addEventListener('message', this.filterApply)
    // this.filterApply()
  },
  beforeDestroy () {
    window.removeEventListener('message', this.filterApply)
  },
  computed: {
    isWidgetVersion () {
      return this.$store.state.customer.theme
    },
    IsFooterModalOpen () {
      return this.$store.state.isFooterModalOpen
    },
    IsLocitModalOpen () {
      return this.$store.state.isLocitModalOpen
    },
    geoSet () {
      return this.$store.state.geolocation
    },
    customerUrl () {
      return this.$store.state.customer.url
    },
    autocompleteList () {
      return this.$store.state.autocompleteList
    }
  },
  watch: {
    geoSet: {
      handler () {
        if (this.$store.state.geolocation.error.code !== 1) {
          this.$store.commit('updatePosition', [{ lat: this.$store.state.geolocation.lat, lng: this.$store.state.geolocation.lng, zoom: 16 }])
        }
      },
      deep: true
    }
  },
  methods: {
    filterApply: function (event) {
      console.log(event)
      if (event.data.content) {
        this.$store.dispatch('get_essentials', {
          key: `${event.data.content.key}`
        //  key: `${'5DFC0961AB6BEF40736BA3099EE27491'}`
        }).then((res) => { console.log(res) }).catch(err => console.log(err))
        this.locitAddress = event.data.content.address
      }
      // else {
      //   this.$store.state.keyError = 'Not valid cutomer key'
      // }
    },
    emitMethod () {
      EventBus.$emit('popupClose')
    },
    clearKodObioru () {
      this.kodOdbioru = ''
      this.$store.commit('clearPointId')
    },
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
      this.$vuexGeolocation.getCurrentPosition()
      if (this.IsFooterModalOpen) {
        this.closeFooterModal()
      }
    },
    getSuggestionValue (suggestion) {
      if (suggestion) {
        this.suggestionText = suggestion.item
        this.$store.commit('updatePosition', [{ lat: Number(suggestion.item.y), lng: Number(suggestion.item.x), zoom: 16 }])
        this.customSuggestion = suggestion.item
        this.$store.commit('updateLocitAddress', this.suggestionText)
        return this.suggestionText.city + ', ' + this.suggestionText.prefix + ' ' + this.suggestionText.street + ' ' + this.suggestionText.building
      } else {
        return 'Wybierz punkt z listy'
      }
    },
    logResult (item) {
      this.closeLocitModal()
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
    kodOdbioruMethod () {
      if (this.kodOdbioru.length >= 3) {
        return this.$store.dispatch('get_autocomplete', {
          id: this.kodOdbioru,
          key: this.$store.state.customer.key
        })
      }
    },
    logKodResult (item) {
      this.closeLocitModal()
      if (item) {
        this.placeHolder = item.item
        this.kodOdbioru = item.item
        this.$store.commit('changePointId', this.kodOdbioru)
        // this.$http.get(`https://api.pickuppointsmap.dev.beecommerce.pl/pickup-points-map?id=` + this.kodOdbioru).then(res => {
        //   var mapPoint = res.data.response
        //   this.$store.commit('updatePosition', [{ lat: Number(mapPoint.pickupPoints[0].lat), lng: Number(mapPoint.pickupPoints[0].lon), zoom: 16 }])
        //   console.log('Map point: ', mapPoint)
        // }).catch(error => {
        //   console.log(error)
        // })
        // this.$store.dispatch('get_points', {
        //   lat: '',
        //   lng: '',
        //   dist: '',
        //   filtered: '',
        //   id: `id=${this.kodOdbioru}`
        // })
        // this.$http.get(`https://api.pickuppointsmap.dev.beecommerce.pl/pickup-points-list?id=` + this.kodOdbioru).then(res => {
        //   var listPoint = res.data.response
        //   console.log('List point: ', listPoint)
        // }).catch(error => {
        //   console.log(error)
        // })
      }
    },
    getSuggestionCode (suggestion) {
      if (suggestion) {
        this.emitMethod()
        this.suggestionCode = suggestion.item
        return this.suggestionCode
      } else {
        return 'Wybierz punkt z listy'
      }
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
    height: 29px;
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
    }
 }
}
.input-tagV2 input{
 padding-right: 25px;
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
.autosuggest__results-item--highlighted{
    background-color: #DD2C54;
}

</style>

<style lang="scss" scoped>
.active-input {
  flex-basis: 60% !important;
}
.suggest-box {
  position: relative;
  display: block;
  // flex-basis: 40%;
  width: 75%;
}
.suggest-box-punkt{
  position: relative;
  display: block;
  flex-basis: 25%;
}
.span-location{
  position: absolute;
  right: 5px;
  top: 20px;
}
.span-locationV2{
  top: 16px;
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
    background: url('../../assets/icons/clear.png') 0 0 no-repeat;
    background-size: cover;
  }
  .span-location {
    right: 50px;
    top: 64px;
  }
  padding: 50px 15px 0;
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
  width: 22px;
  height: 22px;
  display: flex;
  cursor: pointer;
  filter: grayscale(0.5) opacity(0.5);
  background: url('../../assets/icons/clear.png') 0 0 no-repeat;
  background-size: cover;
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
  height: 35px;
  margin: 10px 0;
  cursor: pointer;
  &.active{
    background-color: #E5E5E5;
    border-radius: 3px;
  }
  &:before{
    content: '';
    background: url('../../assets/icons/gps24px.svg') 0 0 no-repeat;
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
  cursor: pointer;
  // padding-left: 5px;
  padding-left: 25px;
  // flex-basis: 25%;
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
    content: url(../../assets/icons/gps24px.svg);
    position: absolute;
    left: 5px;
    width: 17px;
    height: 25px;
    filter: opacity(0.4)
  }
  &.active{
    background-color: #3F87F5;
    color:#FFFFFF;
    cursor: pointer;
  }
}
.lub{
  flex-basis: 5%;
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  color: #AAAAAA;
  margin: 0;
  padding: 0 5px;
}
.input-tag{
  position: relative;
  display: flex;
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
  flex: 0 0 65%;
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
   font-size: 12px;
 }
}
</style>
