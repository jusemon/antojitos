import Firebase from 'firebase'

const connection = Firebase.initializeApp(process.env.FIREBASE)
const DB = connection.database()
const AUTH = connection.auth()
export default function install (Vue, { router }) {
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
    }
  })
}
