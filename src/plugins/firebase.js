import Firebase from 'firebase'
const connection = Firebase.initializeApp({
  apiKey: 'AIzaSyBG2UVTAecgDlY27f1IRP_pPefBAKgGop0',
  authDomain: 'antojitos-26a8f.firebaseapp.com',
  databaseURL: 'https://antojitos-26a8f.firebaseio.com',
  projectId: 'antojitos-26a8f',
  storageBucket: 'antojitos-26a8f.appspot.com',
  messagingSenderId: '810658900719'
})
const DB = connection.database()
const AUTH = connection.auth()
export default function install (Vue, { router }) {
  AUTH.onAuthStateChanged(user => {
    if (!user) {
      router.push({ path: 'auth' })
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
