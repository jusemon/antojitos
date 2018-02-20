<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <q-field :error="$v.form.name.$error" error-label="¡El campo es requerido!">
      <q-input 
        v-model="form.name"
        float-label="Nombre"
        @blur="$v.form.name.$touch"
      />
    </q-field>
    <q-field :error="$v.form.place.$error" error-label="¡El campo es requerido!">
      <q-input
        v-model="form.place"
        float-label="Posible lugar"
        @blur="$v.form.place.$touch"
        :error="$v.form.place.$error"
      />
    </q-field>
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
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      form: {
        name: '',
        place: ''
      }
    }
  },
  validations: {
    form: {
      name: { required },
      place: { required }
    }
  },
  methods: {
    create () {
      var self = this
      self.$v.form.$touch()
      if (self.$v.form.$error) {
        Toast.create('Por favor verifica los errores.')
        return
      }
      var antojitos = self.$db.ref('antojitos')
      var antojo = {
        name: self.form.name,
        place: self.form.place,
        date: Date(),
        user: {
          id: self.$auth.currentUser.uid,
          photoURL: self.$auth.currentUser.photoURL
        }
      }
      antojitos.push(antojo)
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
