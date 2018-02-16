<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title class="text-center">
        Antojitos
      </q-toolbar-title>
    </q-toolbar>
    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->

      <q-list no-border link inset-delimiter>
        <q-list-header>{{user.displayName}}</q-list-header>
        <q-side-link item to="antojitos">
          <q-item-side icon="list" />
          <q-item-main label="Ver Antojitos" />
        </q-side-link>
        <q-item @click="logout">
          <q-item-side icon="exit to app" />
          <q-item-main label="Cerrar Sesión" />
        </q-item>
      </q-list>
    </div>
    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <router-view />
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
  QSideLink,
  QItem,
  QItemSide,
  QItemMain
} from 'quasar'

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QSideLink,
    QItem,
    QItemSide,
    QItemMain
  },
  data () {
    return {
      user: {
        displayName: 'Invitado'
      }
    }
  },
  computed: {
  },
  methods: {
    logout () {
      this.$auth.signOut()
      return ''
    }
  },
  mounted () {
    if (this.$auth.currentUser === null) {
      this.$router.push({ path: 'auth' })
    }
    else {
      this.user = this.$auth.currentUser
    }
  }
}
</script>

<style lang="stylus">
</style>
