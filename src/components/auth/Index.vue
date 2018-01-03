<template>
  <q-layout>
    <div class="padding text-center">
      <div class="logotipo text-center">
        Logotipo por hacer
      </div>
      <q-btn color="red" @click="signIn('google')">Ingresa con Google</q-btn>
      <q-btn color="blue" @click="signIn('facebook')">Ingresa con Facebook</q-btn>
    </div>
  </q-layout>
</template>
<script>
  import {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain
  } from 'quasar'
  import * as firebase from 'firebase'
  export default {
    name: 'auth',
    components: {
      QLayout,
      QToolbar,
      QToolbarTitle,
      QBtn,
      QIcon,
      QList,
      QListHeader,
      QItem,
      QItemSide,
      QItemMain
    },
    methods: {
      signIn: function (signProvider) {
        var provider = null
        switch (signProvider) {
          case 'google':
            provider = new firebase.auth.GoogleAuthProvider()
            break
          case 'facebook':
            provider = new firebase.auth.FacebookAuthProvider()
            break
          default:
            return
        }
        provider.addScope('profile')
        provider.addScope('email')
        this.$auth.signInWithRedirect(provider)
      }
    },
    mounted: function () {
      this.$auth.onAuthStateChanged(user => {
        if (user) {
          this.$router.push({ path: '/' })
        }
      })
    }
  }
</script>
<style scoped>
  .padding {
    padding: 10px
  }
  .logotipo {
    background: linear-gradient(#DD2222, #059);
    height: 50vh;
    margin: 20px;

  }
</style>
