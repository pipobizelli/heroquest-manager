import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faCompass, faEdit, faTrashAlt, faPlus, faPlusSquare, faCouch, faUserPlus, faDungeon, faSkull, faEyeSlash, faExclamationTriangle, faShapes, faBook, faTshirt, faTh, faSquare, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function () {
  library.add([faCheck, faCompass, faEdit, faTrashAlt, faPlus, faPlusSquare, faCouch, faUserPlus, faDungeon, faSkull, faEyeSlash, faExclamationTriangle, faShapes, faBook, faTshirt, faTh, faSquare, faMapMarkerAlt])
  Vue.component('font-awesome-icon', FontAwesomeIcon)
}
