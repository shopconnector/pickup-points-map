import Vue from 'vue'
import Vuex from 'vuex'
import APIService from './services/APIService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    places: {},
    lastvisit: {},
    filtersCount: 0,
    showListFooter: false,
    isFilterMobileOpen: 0,
    isFooterModalOpen: 0,
    isLocitModalOpen: 0,
    WidgetVersion: false,
    isFilterMobilOpen: 1,
    zoom: 7,
    lat: 53.0409,
    lng: 19.2850,
    radiusOfVisibily: 0,
    filteredMarkers: [],
    testMarkers: [
      {lat: 53.06616, pickup_type: 'Poczta Polska', lon: 19.287343},
      {lat: 53.08668, pickup_type: 'Poczta Polska', lon: 19.195922},
      {lat: 53.0675, pickup_type: 'In Post', lon: 19.406469},
      {lat: 53.064636, pickup_type: 'Żabka', lon: 19.409622},
      {lat: 53.063569, pickup_type: 'In Post', lon: 19.41083},
      {lat: 53.0659, pickup_type: 'Poczta Polska', lon: 19.411677},
      {lat: 53.07249, pickup_type: 'In Post', lon: 19.41168},
      {lat: 53.06452, pickup_type: 'Poczta Polska', lon: 19.418736},
      {lat: 53.0626, pickup_type: 'In Post', lon: 19.4202},
      {lat: 53.06826, pickup_type: 'Poczta Polska', lon: 19.417981}
    ],
    // markers: []
    markers: [
      {
        id: 'm1',
        position: { lat: 52.229676, lng: 21.012229 },
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
        id: 'm3',
        position: { lat: 52.228740, lng: 21.033668 },
        address1: 'Kalinowa 13',
        address2: 'Poznań',
        zip: '33145',
        shop: 'Prywatny operator logistyczny',
        phone: '12334555',
        openTime: 'pn - pt: 8:00 - 18:00',
        openTime2: 'so: 8:00 - 16:00',
        visible: true,
        openSat: true,
        openSun: false,
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
        address1: 'Romualda Gutta 5B',
        address2: 'Chorzów',
        zip: '12213',
        shop: 'Szybka wysyłka',
        phone: '12334132',
        openTime: 'pn - pt: 8:00 - 18:00',
        openTime2: 'so: 8:00 - 16:00',
        visible: true,
        openSat: false,
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
      },
      {
        id: 'm7',
        position: { lat: 52.244960, lng: 21.014360 },
        address1: 'Pod Strzechą 4',
        address2: 'Warszawa',
        zip: '12263',
        shop: 'Dostawa przesyłek ',
        phone: '334412343',
        openTime: 'pn - pt: 8:00 - 18:00',
        openTime2: 'so: 8:00 - 16:00',
        visible: true,
        openSat: true,
        openSun: true,
        openNight: false,
        disabledPeople: false,
        parking: false,
        cashOnDelivery: false,
        type: 'paczkaWRuchu',
        icon: {
          iconUrl: require('./assets/logos/paczka_w_ruchu.jpg'),
          iconSize: [52, 52],
          iconAnchor: [26, 52],
          alt: 'Paczka w Ruchu image'
        }
      }
    ]
  },
  mutations: {
    openListFooter (state) {
      state.showListFooter = true
    },
    closeListFooter (state) {
      state.showListFooter = false
    },
    openFilterMobile (state) {
      state.isFilterMobileOpen = 1
    },
    changeRadiusOfVisibility (state, newRadius) {
      if (newRadius) state.radiusOfVisibily = newRadius
    },
    openFooterModal (state) {
      state.isFooterModalOpen = 1
    },
    openLocitModal (state) {
      state.isLocitModalOpen = 1
    },
    closeFilterMobile (state) {
      state.isFilterMobileOpen = 0
    },
    closeFooterModal (state) {
      state.isFooterModalOpen = 0
    },
    closeLocitModal (state) {
      state.isLocitModalOpen = 0
      state.isFooterModalOpen = 0
    },
    closeAllModal (state) {
      state.isFooterModalOpen = 0
      state.isLocitModalOpen = 0
      state.isFilterMobileOpen = 0
    },
    howManyFiltersApplies (state, n) {
      state.filtersCount = n
    },
    // API CALLS
    get_points_map (state) {
      state.status = 'loading points'
    },
    get_points_map_succ (state, points) {
      state.markers = points
      state.status = 'success, points loaded'
    },
    get_points_map_err (state) {
      state.status = 'error, points couldnt be loaded'
    },
    // API CALLS ENDS
    updatePosition (state, newPosition) {
      var point = newPosition[0]
      if (state.geolocation.lat !== null && state.geolocation.lng !== null) {
        if (point.zoom) {
          state.zoom = point.zoom
        }
        if (point.lat) {
          state.lat = point.lat
        }
        if (point.lng) {
          state.lng = point.lng
        }
      }
    }
  },
  actions: {
    // GET POINTS FOR MAP
    get_points_map ({commit}, query) {
      return new Promise((resolve, reject) => {
        commit('get_points_map')
        APIService.get_points_map(query)
          .then(res => {
            // const points = res.response.pickupPoints
            // commit('get_points_map_succ', points)
            resolve(res)
          }).catch(err => {
            commit('get_points_map_err')
            reject(err)
          })
      })
    }
  },
  getters: {
    filterMarkers: (state) => (filters, suppliers) => {
      state.filteredMarkers = state.markers
      if (suppliers.length > 0) {
        state.filteredMarkers = state.filteredMarkers.filter(marker => suppliers.includes(marker.type))
      }
      for (var filter of filters) {
        state.filteredMarkers = state.filteredMarkers.filter(marker => marker[filter])
      }
      if (state.filteredMarkers.length > 0) {
        return state.filteredMarkers
      } else {
        state.filteredMarkers = ['empty']
        return state.filteredMarkers
      }
    },
    clearFilters: state => {
      state.filteredMarkers = []
      return state.filteredMarkers
    }
  }
})
