import axios from 'axios'

const API_URL = 'https://api.pickuppointsmap.dev.beecommerce.pl'

export default {
  get_essentials (query) {
    return axios({
      url: `${API_URL}/widget-essentials?key=${query.key}`
    })
  },
  get_autocomplete (query) {
    return axios({
      url: `${API_URL}/pickup-autocomplete?id=${query.id}&key=${query.key}`
    })
  },
  get_list_points (query) {
    return axios({
    // url: `${API_URL}/pickup-points-list?lat=${query.lat}&lon=${query.lng}&page=${query.page}${query.filtered}`
      url: `${API_URL}/pickup-points-list?${query.lat}${query.lng}${query.id}${query.key}${query.page}${query.filtered}`
    })
  },
  get_points (query) {
    return axios({
      // url: `${API_URL}/pickup-points-map?lat=${query.lat}&lon=${query.lng}&dist=${query.dist}${query.filtered}`

      // `${API_URL}/pickup-points-map?`, {
      //   params: {
      //     lat: query.lat,
      //     lon: query.lng,
      //     dist: query.dist,
      //     '' : query.filtered
      //   }

      url: `${API_URL}/pickup-points-map?${query.lat}${query.lng}${query.id}${query.key}${query.dist}${query.filtered}`

    })
  },
  get_point_details (query) {
    if (query.id) {
      return axios({
        url: `${API_URL}/address-details?lat=${query.lat}&lon=${query.lng}&key=${query.key}&pickup_type=${query.type}&id=${query.id}`
      })
    } else {
      return axios({
        url: `${API_URL}/address-details?lat=${query.lat}&lon=${query.lng}&key=${query.key}&pickup_type=${query.type}`
      })
    }
  }
}
