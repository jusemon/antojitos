// import something here

// leave the export, even if you don't use it
import Firebase from 'firebase'

const connection = Firebase.initializeApp(process.env.FIREBASE)
const DB = connection.database()
const AUTH = connection.auth()
const STORAGE = connection.storage()
export default ({ app, router, Vue }) => {
  AUTH.onAuthStateChanged(user => {
    if (!user) {
      router.push({ name: 'auth' })
    }
  })
  Object.defineProperties(Vue.prototype, {
    $db: {
      get () {
        return DB
      }
    },
    $auth: {
      get () {
        return AUTH
      }
    },
    $storage: {
      get () {
        return STORAGE
      }
    }
  })
}
