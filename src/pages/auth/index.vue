<template>
  <q-layout ref="layout" view="lHh Lpr fff" :class="{'bg-red-3': true}">
    <q-layout-header>
        <q-toolbar color="primary">
          <q-toolbar-title class="text-center">
            Antojitos
          </q-toolbar-title>
        </q-toolbar>
      </q-layout-header>
      <q-page-container>
          <div class="padding text-center">
            <div class="heart-container">
              <svg class="heart" viewBox="0 0 32 29.6">
                <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                  c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
              </svg>
            </div>
            <div class="botones-login">
              <q-btn class="btn-login" color="red" @click="signIn('google')">Ingresa con Google</q-btn>
              <q-btn class="btn-login" color="blue" @click="signIn('facebook')">Ingresa con Facebook</q-btn>
            </div>
          </div>
      </q-page-container>
  </q-layout>
</template>

<script>
import { Loading } from 'quasar'
import firebase from 'firebase'
export default {
  name: 'auth',
  methods: {
    signIn: function (signProvider) {
      var provider = null
      switch (signProvider) {
        case 'google':
          provider = new firebase.auth.GoogleAuthProvider()
          provider.addScope('profile')
          provider.addScope('email')
          break
        case 'facebook':
          provider = new firebase.auth.FacebookAuthProvider()
          provider.addScope('public_profile')
          provider.addScope('email')
          break
        default:
          return
      }
      this.$auth.signInWithRedirect(provider)
    }
  },
  mounted: function () {
    Loading.show()
  },
  created: function () {
    this.$auth.onAuthStateChanged(user => {
      if (user) {
        this.$router.push({ path: '/' })
      }
    })
    this.$auth.getRedirectResult().then(result => {
      Loading.hide()
    }).catch(error => {
      self.$q.dialog({
        title: '¡Atención!',
        message: JSON.stringify(error),
        ok: '¡Oh no!'
      }).then(() => {
      }).catch(() => { })
      console.log(error)
    })
  }
}
</script>
<style lang="styl" scoped>
  @import '~variables';
  .padding {
    padding: 10px
  }

  .botones-login {
    margin: 5%;
  }

  .botones-login .btn-login {
    width: 98%;
    margin: 1%;
  }

  @keyframes heartbeat {
    0% {
      transform: scale( .75);
    }
    20% {
      transform: scale( 1);
    }
    40% {
      transform: scale( .75);
    }
    60% {
      transform: scale( 1);
    }
    80% {
      transform: scale( .75);
    }
    100% {
      transform: scale( .75);
    }
  }

  .heart {
    position: relative;
    top: 5px;
    height: 50vh;
    animation: heartbeat 1s ease infinite;
    fill: $primary;
  }
</style>
