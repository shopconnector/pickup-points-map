import axios from 'axios'

const API_URL = 'https://api.pickuppointsmap.dev.beecommerce.pl'

export default {
  get_autocomplete (query) {
    return axios({
      url: `${API_URL}/pickup-autocomplete?id=${query.id}`
    })
  },
  get_list_points (query) {
    return axios({
    // url: `${API_URL}/pickup-points-list?lat=${query.lat}&lon=${query.lng}&page=${query.page}${query.filtered}`
      url: `${API_URL}/pickup-points-list?${query.lat}${query.lng}${query.page}${query.filtered}${query.id}`
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

      url: `${API_URL}/pickup-points-map?${query.lat}${query.lng}${query.dist}${query.filtered}${query.id}`

    })
  },
  get_point_details (query) {
    return axios({
      url: `${API_URL}/address-details?lat=${query.lat}&lon=${query.lng}&pickup_type=${query.type}`
    })
  }
}
