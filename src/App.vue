<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
  /*
   * Root component
   */
  import * as firebase from 'firebase'
  export default {
    mounted: function () {
      var user = firebase.auth().currentUser
      if (user) {
        console.log(user)
      }
      else {
        console.log('Hora del login')
        var provider = new firebase.auth.GoogleAuthProvider()
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
        firebase.auth().signInWithPopup(provider).then(function (result) {
          console.log(result)
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style></style>
