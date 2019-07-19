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
    WidgetVersion: false,
    isFilterMobilOpen: 1,
    zoom: 7,
    lat: 53.0409,
    lng: 19.2850,
    radiusOfVisibily: 0,
    filteredMarkers: [],
    markerDetails: [],
    filteredMapPoints: [],
    filteredListPoints: [],
    pointMarkers: [],
    pageNumber: 1,
    listMarkers: []
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
    get_points_succ (state, points) {
      if (state.zoom < 13) {
        state.pointMarkers = []
        state.status = 'success, but distance too long'
      } else {
        state.pointMarkers = points
        state.status = 'success, points loaded'
      }
    },
    get_closest_points_succ (state, points) {
      if (state.zoom < 13) {
        state.pointMarkers = []
        state.status = 'success, but distance too long'
      } else {
        state.pointMarkers = points
        state.zoom = 13
        state.status = 'success, points loaded'
      }
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
    // FILTERED POINTS COMMIT
    get_filtered_points (state) {
      state.state = 'loading filtered points'
    },
    get_filtered_points_succ (state, filteredPoints) {
      if (state.zoom < 13) {
        state.filteredMapPoints = []
        state.status = 'success, but distance too long'
      } else {
        state.filteredMapPoints = filteredPoints
        state.status = 'success, filtered points loaded'
      }
    },
    get_filtered_points_err (state) {
      state.status = 'error, filtered points couldnt be loaded'
    },
    // FILTERED LIST POINTS COMMIT
    get_filtered_list_points (state) {
      state.status = 'loading filtered list points'
    },
    get_filtered_list_points_succ (state, filteredPointsList) {
      if (state.zoom < 13) {
        state.filteredListPoints = []
        state.status = 'success, but distance too long for list'
      } else {
        if (state.pageNumber === 1) {
          state.filteredListPoints = filteredPointsList
          state.status = 'success, filtered list points loaded'
        } else {
          state.filteredListPoints = state.filteredListPoints.concat(filteredPointsList)
          state.status = 'success, more filtered list points loaded'
        }
      }
    },
    get_filtered_list_points_err (state) {
      state.status = 'loading filtered list points'
    }
  },
  actions: {
    // GET POINTS FOR MAP
    get_points ({commit}, query) {
      return new Promise((resolve, reject) => {
        commit('get_points')
        APIService.get_points(query)
          .then(res => {
            // if (res.data.response_type === 'distance') {
            const points = res.data.response.pickupPoints
            commit('get_points_succ', points)
            // } else {
            //   const pointsClosest = res.data.response.pickupPoints
            //   commit('get_closest_points_succ', pointsClosest)
            // }
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
    get_filtered_points ({commit}, query) {
      return new Promise((resolve, reject) => {
        commit('get_filtered_points')
        APIService.get_filtered_points(query)
          .then(res => {
            console.log('Get map')
            let filteredPoints = []
            if (res.data.response.pickupPoints.length) {
              filteredPoints = res.data.response.pickupPoints
            } else {
              filteredPoints = ['empty']
            }
            commit('get_filtered_points_succ', filteredPoints)
            resolve(res)
          }).catch(err => {
            commit('get_filtered_points_err')
            reject(err)
          })
      })
    },
    get_filtered_list_points ({commit}, query) {
      return new Promise((resolve, reject) => {
        commit('get_filtered_list_points')
        APIService.get_filtered_list_points(query)
          .then(res => {
            console.log('Get list')
            let filteredPointsList = []
            if (res.data.response.pickupPoints.length) {
              filteredPointsList = res.data.response.pickupPoints
            } else {
              filteredPointsList = ['empty']
            }
            commit('get_filtered_list_points_succ', filteredPointsList)
            resolve(res)
          }).catch(err => {
            commit('get_filtered_list_points_err')
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
    }
  },
  getters: {
    clearAPIFilters: state => {
      state.filteredListPoints = []
      state.filteredMapPoints = []
      return (state.filteredListPoints, state.filteredMapPoints)
    }
    // filterMarkers: (state) => (filters, suppliers) => {
    //   state.filteredMarkers = state.markers
    //   if (suppliers.length > 0) {
    //     state.filteredMarkers = state.filteredMarkers.filter(marker => suppliers.includes(marker.type))
    //   }
    //   for (var filter of filters) {
    //     state.filteredMarkers = state.filteredMarkers.filter(marker => marker[filter])
    //   }
    //   if (state.filteredMarkers.length > 0) {
    //     return state.filteredMarkers
    //   } else {
    //     state.filteredMarkers = ['empty']
    //     return state.filteredMarkers
    //   }
    // },
    // clearFilters: state => {
    //   state.filteredMarkers = []
    //   return state.filteredMarkers
    // }
  }
})
