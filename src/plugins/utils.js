var utils = {
  stamp: function (date) {
    var current = new Date()
    date = new Date(date)
    var hasBeenPassed = (current.getTime() - date.getTime()) / 1000 / 60
    var use = ''
    if (hasBeenPassed < 1) {
      return 'Hace menos de un minuto'
    }
    if (hasBeenPassed < 60) {
      use = 'minuto'
    } else {
      hasBeenPassed = hasBeenPassed / 60
      if (hasBeenPassed < 24) {
        use = 'hora'
        if (hasBeenPassed < 2) {
          return 'Hace una hora'
        }
      } else {
        hasBeenPassed = hasBeenPassed / 24
        use = 'día'
        if (hasBeenPassed < 2) {
          return 'Hace un día'
        }
      }
    }
    hasBeenPassed = parseInt(hasBeenPassed)
    use = hasBeenPassed > 1 ? use + 's' : use
    return 'Hace ' + hasBeenPassed + ' ' + use
  }
}

export default ({ app, router, Vue }) => {
  Object.defineProperties(Vue.prototype, {
    $utils: {
      get () {
        return utils
      }
    }
  })
}
