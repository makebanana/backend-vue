import { assert } from './utils/log'
import Events from './utils/events'
import install from './src/install'
import ContentMenu from './src/contentmenu'

export default class PathTab {
  constructor (options) {
    this.pathMap = []
    this.defaultTabs = []
    this.defaultPath = ''
    this.noMatch = {}
    this.menus = null

    assert(Array.isArray(options.path), 'you should set Array for path')
    options.path.forEach(item => {
      item.closable = typeof item.closable === 'undefined' ? true : item.closable
      this.pathMap.push(item)

      if (item.isDefault) {
        this.defaultTabs.push(item)
        this.defaultPath = item.path
      }

      if (item.isNoMatch && !this.noMatch.path) {
        this.noMatch = item
      }
    })

    this.noMatch = this.noMatch.path ? this.noMatch : {
      path: 'vue_pathtab_nomatch',
      name: 'can find',
      component: <div>404</div>,
      isLock: false
    }

    if (options.contextmenu !== false) {
      this.menu = new ContentMenu(options.contextmenu)
    }
  }

  beforeOpen (to, from, next) {
    next()
  }

  open (config) {
    Events.emit('PATHTABS_ADD', config)
  }

  reload (path = this.path) {
    Events.emit('PATHTABS_RELOAD', path)
  }

  close (path = this.path) {
    Events.emit('PATHTABS_CLOSE', path)
  }

  closeOther (path = this.path) {
    Events.emit('PATHTABS_CLOSEOTHER', path)
  }

  lock (path = this.path) {
    Events.emit('PATHTABS_LOCK', path)
  }

  unlock (path = this.path) {
    console.log(path)
    Events.emit('PATHTABS_UNLOCK', path)
  }
}

PathTab.install = install
