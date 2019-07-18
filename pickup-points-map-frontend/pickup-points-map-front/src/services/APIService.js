import axios from 'axios'

const API_URL = 'https://api.pickuppointsmap.dev.beecommerce.pl'

export default {
  get_filtered_list_points (query) {
    return axios({
      url: `${API_URL}/pickup-points-map?lat=${query.lat}&lon=${query.lng}&page=${query.page}${query.filtered}`
    })
  },
  get_filtered_points (query) {
    return axios({
      url: `${API_URL}/pickup-points-map?lat=${query.lat}&lon=${query.lng}&dist=${query.dist}${query.filtered}`
    })
  },
  get_list_points (query) {
    return axios({
      url: `${API_URL}/pickup-points-list?lat=${query.lat}&lon=${query.lng}&page=${query.page}`
    })
  },
  get_points (query) {
    return axios({
      url: `${API_URL}/pickup-points-map?lat=${query.lat}&lon=${query.lng}&dist=${query.dist}`
    })
  },
  get_point_details (query) {
    return axios({
      url: `${API_URL}/address-details?lat=${query.lat}&lon=${query.lng}&pickup_type=${query.type}`
    })
  }
}
