<template>
  <q-page padding>
    <q-field dark :error="$v.form.name.$error" error-label="¡El campo es requerido!">
      <q-input dark v-model="form.name" float-label="Nombre" @blur="$v.form.name.$touch" />
    </q-field>
    <q-field dark :error="$v.form.place.$error" error-label="¡El campo es requerido!">
      <q-input dark v-model="form.place" float-label="Posible lugar" @blur="$v.form.place.$touch" :error="$v.form.place.$error"
      />
    </q-field>
    <q-btn round color="secondary" @click="create" class="fixed" style="right: 18px; bottom: 18px">
      <q-icon name="done" />
    </q-btn>
  </q-page>
</template>

<script>
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
        self.$q.notify({ message: 'Por favor verifica los errores.', color: 'secondary' })
        return
      }
      var antojitos = self.$db.ref('antojitos')
      var antojo = {
        name: self.form.name,
        place: self.form.place,
        date: Date(),
        success: false,
        user: {
          id: self.$auth.currentUser.uid,
          photoURL: self.$auth.currentUser.photoURL
        }
      }
      antojitos.push(antojo)
      self.$q.notify({ message: 'Se ha registrado el antojito satisfactoriamente.', color: 'secondary' })
      self.$router.push({ name: 'list_antojitos' })
    }
  }
}
</script>

<style>
</style>
