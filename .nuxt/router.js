import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _0f74546a = () => interopDefault(import('../pages/characters/index.vue' /* webpackChunkName: "pages/characters/index" */))
const _6451454a = () => interopDefault(import('../pages/preview.vue' /* webpackChunkName: "pages/preview" */))
const _328258de = () => interopDefault(import('../pages/quests/index.vue' /* webpackChunkName: "pages/quests/index" */))
const _1019a7c6 = () => interopDefault(import('../pages/sessions/index.vue' /* webpackChunkName: "pages/sessions/index" */))
const _29949142 = () => interopDefault(import('../pages/characters/_character.vue' /* webpackChunkName: "pages/characters/_character" */))
const _042ff8b4 = () => interopDefault(import('../pages/quests/_quest.vue' /* webpackChunkName: "pages/quests/_quest" */))
const _07f1e448 = () => interopDefault(import('../pages/sessions/_session.vue' /* webpackChunkName: "pages/sessions/_session" */))
const _5dd09025 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      window.history.scrollRestoration = 'auto'
    })

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      window.history.scrollRestoration = 'manual'
    })
  }
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/characters",
      component: _0f74546a,
      name: "characters"
    }, {
      path: "/preview",
      component: _6451454a,
      name: "preview"
    }, {
      path: "/quests",
      component: _328258de,
      name: "quests"
    }, {
      path: "/sessions",
      component: _1019a7c6,
      name: "sessions"
    }, {
      path: "/characters/:character",
      component: _29949142,
      name: "characters-character"
    }, {
      path: "/quests/:quest",
      component: _042ff8b4,
      name: "quests-quest"
    }, {
      path: "/sessions/:session",
      component: _07f1e448,
      name: "sessions-session"
    }, {
      path: "/",
      component: _5dd09025,
      name: "index"
    }],

    fallback: false
  })
}
