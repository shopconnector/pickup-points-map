import axios from 'axios'

const API_URL = 'https://api.pickuppointsmap.dev.beecommerce.pl'

export default {
  get_points (query) {
    return axios({
      url: `${API_URL}/pickup-points&${query.lat}&${query.lon}&${query.dist}`
    })
  }
}
