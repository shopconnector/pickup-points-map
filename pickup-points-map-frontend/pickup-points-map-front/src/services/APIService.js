import axios from 'axios'

const API_URL = process.env.API_URL

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
      url: `${API_URL}/pickup-points-map?${query.lat}${query.lng}${query.id}${query.key}${query.dist}${query.filtered}`
    })
  },
  get_point_details (query) {
    return axios({
      // url: `${API_URL}/address-details?lat=${query.lat}&lon=${query.lng}&key=${query.key}&pickup_type=${query.type}`
      url: `${API_URL}/address-details?${query.lat}${query.lng}${query.key}${query.type}${query.id}`
    })
  }
}
