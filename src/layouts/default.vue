<template>
  <q-layout view="lHh Lpr lFf" :class="{ 'in-form': inForm }">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn
          v-if="!inForm"
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-btn
          v-if="inForm"
          flat
          dense
          round
          @click="$router.go(-1)"
        >
          <q-icon name="arrow_back" />
        </q-btn>
        <q-toolbar-title class="text-center">
          Antojitos
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" :class="{'animate-base': true, 'no-shadow': true, 'animate': inForm}">
      </q-btn>
    </q-page-sticky>
    <q-layout-drawer
      v-if="!inForm"
      v-model="leftDrawerOpen"
      content-class="bg-grey-2"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>{{$auth.currentUser.displayName}}</q-list-header>
        <q-item :to="{ name: 'list_antojitos' }">
          <q-item-side icon="list" />
          <q-item-main label="Ver Antojitos" />
        </q-item>
        <q-item @click.native="logout">
          <q-item-side icon="exit to app" />
          <q-item-main label="Cerrar Sesión" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  computed: {
    inForm () {
      if (['create_antojito', 'update_antojito'].indexOf(this.$route.name) > -1) {
        return true
      }
      return false
    }
  },
  methods: {
    logout () {
      this.$auth.signOut()
    }
  },
  mounted () {
    if (this.$auth.currentUser === null) {
      this.$router.push({ name: 'auth' })
    }
  },
  created () {
    this.$q.addressbarColor.set('#d32f2f')
  }
}
</script>

<style>
.slow {
  transition: 10s ease-in;
}
.animate-base {
  z-index: -1;
  background-color: red;
  border-radius: 1000px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.7);
  transition: 0.5s ease-in;
}
.animate-base.animate {
  transform: scale(75);
  right: 0;
  bottom: 0;
  box-shadow: none;
}

@keyframes float-button-animation {
  80% {
    border-radius: 1000px;
  }
  100% {
    border-radius: 1000%/500% 0 0 0;
    width: 100%;
    height: 100%;
  }
}

.in-form .q-icon.cursor-pointer.material-icons.text-primary.q-item-icon, .in-form .q-if-focused.text-primary {
  color: white !important;
}
</style>
