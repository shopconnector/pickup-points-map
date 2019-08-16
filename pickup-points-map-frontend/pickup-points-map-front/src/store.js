import Vue from 'vue'
import Vuex from 'vuex'
import APIService from './services/APIService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    filtersCount: 0,
    showListFooter: false,
    isFilterMobileOpen: 0,
    isFooterModalOpen: 1,
    isLocitModalOpen: 0,
    isFilterMobilOpen: 1,
    toogleModal: false,
    zoom: 7,
    lat: 53.0409,
    lng: 19.2850,
    radiusOfVisibily: 1,
    markerDetails: [],
    pointMarkers: [],
    closestPunktErrors: '',
    // closestPointMarkers: [],
    pageNumber: 1,
    // zoomClosest: null,
    // innerFilter: '',
    // innerAddress: '',
    selectedPoint: null,
    listMarkers: [],
    storeFilters: [],
    autocompleteList: [],
    pointId: '',
    keyError: false,
    suggestionTextLocit: '',
    linkToRoad: {
      x: 0,
      y: 0
    },
    // providerToPickupTypeMapping: {
    //   'In Post': ['In Post'],
    //   'Poczta Polska': ['Fresh Market', 'Paczka w Ruchu', 'Poczta Polska', 'Żabka', 'Orlen'],
    //   'DPD Pickup': ['DPD Pickup'],
    //   'Paczka w Ruchu': ['Paczka w Ruchu']
    // },
    customer: {
      // key: '5DFC0961AB6BEF40736BA3099EE27491',
      // id: '123123',
      // name: 'bardotti',
      // theme: 0,
      // providers: ['Poczta Polska', 'In Post', 'DPD Pickup'],
      // url: 'https://dev.bardotti.pl'
    }
  },
  mutations: {
    updateLinkToRoad (state, payload) {
      state.linkToRoad.x = payload.x
      state.linkToRoad.y = payload.y
    },
    updateLocitAddress (state, payload) {
      state.suggestionTextLocit = payload
    },
    clearPointId (state) {
      state.pointId = ''
    },
    changePointId (state, payload) {
      state.pointId = payload
    },
    changeSelectedPoint (state, payload) {
      state.selectedPoint = payload
    },
    newStoreFilters (state, payload) {
      if (payload) state.storeFilters = payload
    },
    openListFooter (state) {
      state.showListFooter = true
    },
    closeListFooter (state) {
      state.showListFooter = false
    },
    openFilterMobile (state) {
      state.isFilterMobileOpen = 1
    },
    // changeZoomClosest (state, payload) {
    //   state.zoom = payload
    //   state.closestPointMarkers = []
    // },
    changeRadiusOfVisibility (state, newRadius) {
      if (newRadius) state.radiusOfVisibily = newRadius
    },
    changePageNumber (state, number) {
      state.pageNumber = number
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
    updatePosition (state, newPosition) {
      var point = newPosition[0]
      if (point.zoom) {
        state.zoom = point.zoom
      }
      if (point.lat) {
        state.lat = point.lat
      }
      if (point.lng) {
        state.lng = point.lng
      }
    },
    // API CALLS
    get_points (state) {
      state.status = 'loading points'
    },
    get_pointsById_succ (state, points) {
      state.pointMarkers = points
      state.status = 'success, pointsById loaded'
    },
    get_points_succ (state, points) {
      if (state.zoom < 13) {
        state.pointMarkers = []
        state.status = 'success, but distance too long'
      } else {
        state.closestPunktErrors = ''
        state.pointMarkers = points
        state.status = 'success, points loaded'
      }
    },
    get_closest_points_succ (state, points) {
      state.pointMarkers = points
      state.closestPunktErrors = 'success, but distance too long'
      state.status = 'success, closest points loaded'
    },
    get_points_err (state) {
      state.status = 'error, points couldnt be loaded'
    },
    get_list_points (state) {
      state.status = 'loading list points'
    },
    get_list_points_succ (state, points) {
      if (state.zoom < 13) {
        state.listMarkers = []
        state.status = 'success, but distance too long for list'
      } else {
        if (state.pageNumber === 1) {
          state.listMarkers = points
          state.status = 'success, list points loaded'
        } else {
          state.listMarkers = state.listMarkers.concat(points)
          state.status = 'success, more list points loaded'
        }
      }
    },
    get_list_points_err (state) {
      state.status = 'error, list points couldnt be loaded'
    },
    get_point_details (state) {
      state.status = 'loading details'
    },
    get_point_details_succ (state, point) {
      state.markerDetails = point
      state.status = 'success, details point loaded'
    },
    get_point_details_err (state) {
      state.status = 'error, details couldnt be loaded'
    },
    clear_point_details (state) {
      state.markerDetails = []
    },
    get_autocomplete (state) {
      state.status = 'loading autocomplete points'
    },
    get_autocomplete_succ (state, point) {
      state.autocompleteList = point
      state.status = 'success, autocomplete list loaded'
    },
    get_autocomplete_err (state) {
      state.status = 'errorr, autocomplete list couldnt be loaded'
    },
    get_essentials (state) {
      state.status = 'loading customer data'
    },
    get_essentials_succ (state, customer) {
      state.customer = customer
      state.status = 'success, customer data loaded'
      state.keyError = true
    },
    get_essentials_err (state) {
      state.keyError = false
    }
  },
  actions: {
    get_points ({commit}, query) {
      return new Promise((resolve, reject) => {
        commit('get_points')
        APIService.get_points(query)
          .then(res => {
            const points = res.data.response.pickupPoints
            if (res.data.response_type === 'id') {
              commit('get_pointsById_succ', points)
            } else if (res.data.response_type === '10 closest') {
              commit('get_closest_points_succ', points)
            } else {
              commit('get_points_succ', points)
            }
            resolve(res)
          }).catch(err => {
            commit('get_points_err')
            reject(err)
          })
      })
    },
    get_list_points ({commit}, query) {
      return new Promise((resolve, reject) => {
        commit('get_list_points')
        APIService.get_list_points(query)
          .then(res => {
            const newPoints = res.data.response.pickupPoints
            commit('get_list_points_succ', newPoints)
            resolve(res)
          }).catch(err => {
            commit('get_list_points_err')
            reject(err)
          })
      })
    },
    get_point_details ({commit}, query) {
      return new Promise((resolve, reject) => {
        commit('get_point_details')
        APIService.get_point_details(query)
          .then(res => {
            const point = res.data.response
            commit('get_point_details_succ', point)
            resolve(res)
          }).catch(err => {
            commit('get_point_details_err')
            reject(err)
          })
      })
    },
    get_autocomplete ({commit}, query) {
      return new Promise((resolve, reject) => {
        commit('get_autocomplete')
        APIService.get_autocomplete(query)
          .then(res => {
            const point = res.data.response
            commit('get_autocomplete_succ', point)
            resolve(res)
          }).catch(err => {
            commit('get_autocomplete_err')
            reject(err)
          })
      })
    },
    get_essentials ({commit}, query) {
      return new Promise((resolve, reject) => {
        commit('get_essentials')
        APIService.get_essentials(query)
          .then(res => {
            if (query.origin.includes(res.data.response.domain)) {
              const customer = res.data.response
              commit('get_essentials_succ', customer)
            } else {
              commit('get_essentials_err')
            }
            resolve(res)
          }).catch(err => {
            commit('get_essentials_err')
            reject(err)
          })
      })
    }
  },
  getters: {
    clearAPIFilters: state => {
      state.pointMarkers = []
      state.listMarkers = []
      return (state.pointMarkers, state.listMarkers)
    }
  }
})
