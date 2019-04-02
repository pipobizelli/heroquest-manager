import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faCompass, faEdit, faTrashAlt, faPlus, faPlusSquare, faCouch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function () {
  library.add([faCheck, faCompass, faEdit, faTrashAlt, faPlus, faPlusSquare, faCouch])
  Vue.component('font-awesome-icon', FontAwesomeIcon)
}
