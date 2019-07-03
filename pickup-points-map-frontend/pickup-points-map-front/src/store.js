import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    places: {},
    lastvisit: {},
    WidgetVersion: true,
    markers: [
      {
        id: 'm1',
        position: { lat: 52.229676, lng: 21.012229 },
        tooltip: 'tooltip for marker1',
        address1: 'Mazowiecka 50A',
        address2: 'Warszawa',
        zip: '02776',
        shop: 'Sklep Spożywcy',
        phone: '111222333',
        openTime: 'pn - pt: 8:00 - 18:00',
        openTime2: 'so: 8:00 - 16:00',
        visible: true,
        openSat: true,
        openSun: true,
        openNight: true,
        disabledPeople: false,
        parking: true,
        cashOnDelivery: true,
        type: 'zabka',
        icon: {
          iconUrl: require('./assets/logos/żabka.png'),
          iconSize: [52, 52],
          iconAnchor: [26, 52],
          alt: 'Żabka image'
        }
      },
      {
        id: 'm2',
        position: { lat: 52.239050, lng: 21.046113 },
        tooltip: 'tooltip for marker2',
        address1: 'Jasna 3A',
        address2: ' Kraków',
        zip: '05423',
        shop: 'Przesyłki kurierskie',
        phone: '444555666',
        openTime: 'pn - pt: 8:00 - 18:00',
        openTime2: 'so: 8:00 - 16:00',
        visible: true,
        openSat: true,
        openSun: true,
        openNight: true,
        disabledPeople: false,
        parking: true,
        cashOnDelivery: true,
        type: 'dpd',
        icon: {
          iconUrl: require('./assets/logos/dpd.png'),
          iconSize: [52, 52],
          iconAnchor: [26, 52],
          alt: 'DPD image'
        }
      },
      {
        id: 'm3',
        position: { lat: 52.228740, lng: 21.033668 },
        tooltip: 'tooltip for marker3',
        address1: 'Kalinowa 13',
        address2: 'Poznań',
        zip: '33145',
        shop: 'Prywatny operator logistyczny',
        phone: '12334555',
        openTime: 'pn - pt: 8:00 - 18:00',
        openTime2: 'so: 8:00 - 16:00',
        visible: true,
        openSat: true,
        openSun: true,
        openNight: false,
        disabledPeople: false,
        parking: true,
        cashOnDelivery: true,
        type: 'inpost',
        icon: {
          iconUrl: require('./assets/logos/inpost.png'),
          iconSize: [52, 52],
          iconAnchor: [26, 52],
          alt: 'Inpost image'
        }
      },
      {
        id: 'm4',
        position: { lat: 52.235238, lng: 21.008434 },
        tooltip: 'tooltip for marker4',
        address1: 'Romualda Gutta 5B',
        address2: 'Chorzów',
        zip: '12213',
        shop: 'Szybka wysyłka',
        phone: '12334132',
        openTime: 'pn - pt: 8:00 - 18:00',
        openTime2: 'so: 8:00 - 16:00',
        visible: true,
        openSat: true,
        openSun: true,
        openNight: false,
        disabledPeople: false,
        parking: true,
        cashOnDelivery: true,
        type: 'dpdPickup',
        icon: {
          iconUrl: require('./assets/logos/dpd-pickup.png'),
          iconSize: [52, 52],
          iconAnchor: [26, 52],
          alt: 'DpdPickup image'
        }
      },
      {
        id: 'm5',
        position: { lat: 52.233949, lng: 21.017360 },
        tooltip: 'tooltip for marker5',
        address1: 'Fregaty 50A',
        address2: 'Lublin',
        zip: '01277',
        shop: 'Sklep FreshMarket',
        phone: '233332221',
        openTime: 'pn - pt: 8:00 - 18:00',
        openTime2: 'so: 8:00 - 16:00',
        visible: true,
        openSat: true,
        openSun: true,
        openNight: false,
        disabledPeople: true,
        parking: true,
        cashOnDelivery: true,
        type: 'fresh',
        icon: {
          iconUrl: require('./assets/logos/freshmarket.png'),
          iconSize: [52, 52],
          iconAnchor: [26, 52],
          alt: 'Freshmarket image'
        }
      },
      {
        id: 'm6',
        position: { lat: 52.234949, lng: 21.015360 },
        tooltip: 'tooltip for marker6',
        address1: 'Brazylijska 45',
        address2: 'Białystok',
        zip: '98233',
        shop: 'Usługi pocztowe',
        phone: '445566123',
        openTime: 'pn - pt: 8:00 - 18:00',
        openTime2: 'so: 8:00 - 16:00',
        visible: true,
        openSat: true,
        openSun: true,
        openNight: false,
        disabledPeople: true,
        parking: true,
        cashOnDelivery: true,
        type: 'pocztaPolska',
        icon: {
          iconUrl: require('./assets/logos/pocztapolska.png'),
          iconSize: [52, 52],
          iconAnchor: [26, 52],
          alt: 'PocztaPolska image'
        }
      }
    ]
  },
  mutations: {
    updateMarkers (state, value) {
      state.markers = value
    }
  },
  actions: {
    myFilters ({getters}, payload) {
      getters('openNightMarkers')
      getters('openSatMarkers')
      getters('openSunMarkers')
      getters('disabledPeopleMarkers')
      getters('parkingMarkers')
      getters('cashOnDeliveryMarkers')
    }
  },
  getters: {
    openNightMarkers: state => {
      return state.markers.filter(marker => marker.openNight)
    },
    openSatMarkers: state => {
      return state.markers.filter(marker => marker.openSat)
    },
    openSunMarkers: state => {
      return state.markers.filter(marker => marker.openSun)
    },
    disabledPeopleMarkers: state => {
      return state.markers.filter(marker => marker.disabledPeople)
    },
    parkingMarkers: state => {
      return state.markers.filter(marker => marker.parking)
    },
    cashOnDeliveryMarkers: state => {
      return state.markers.filter(marker => marker.cashOnDelivery)
    }
  }
})
