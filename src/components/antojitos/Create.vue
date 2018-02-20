<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <q-input v-model="form.name" float-label="Nombre" placeholder="Nombre del antojito" />
    <q-input v-model="form.description" float-label="Descripción" placeholder="Descripción del antojito" />
    <q-input v-model="form.place" float-label="Posible lugar" placeholder="Posible lugar del antojito" />
    <q-btn
      round
      color="primary"
      @click="create"
      class="fixed"
      style="right: 18px; bottom: 18px"
    >
      <q-icon name="done" />
    </q-btn>
  </div>
</template>

<script>
import { QField, QInput, QBtn, QIcon, Toast } from 'quasar'
export default {
  data () {
    return {
      form: {
        name: '',
        description: '',
        place: ''
      }
    }
  },
  methods: {
    create () {
      var self = this
      var antojitos = self.$db.ref('antojitos')
      antojitos.push({
        name: self.form.name,
        description: self.form.description,
        place: self.form.place,
        user: {
          id: self.$auth.currentUser.uid,
          photoURL: self.$auth.currentUser.photoURL
        }
      })
      Toast.create('Se ha registrado el antojito satisfactoriamente.')
      self.$router.push({ name: 'list_antojitos' })
    }
  },
  components: {
    QField, QInput, QBtn, QIcon
  }
}
</script>

<style>
</style>
