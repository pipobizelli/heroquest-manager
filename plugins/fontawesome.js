import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function () {
  library.add([faCheck])
  Vue.component('font-awesome-icon', FontAwesomeIcon)
}
