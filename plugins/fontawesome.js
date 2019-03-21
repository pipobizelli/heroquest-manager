import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faShoppingBag, faAngleLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faTwitter, faPinterest, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function () {
  library.add([faBars, faShoppingBag, faAngleLeft, faChevronLeft, faChevronRight, faFacebookF, faTwitter, faPinterest, faWhatsapp])
  Vue.component('font-awesome-icon', FontAwesomeIcon)
}
