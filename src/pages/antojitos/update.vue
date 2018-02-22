<template>
  <q-page padding>
    <input v-model="form.id" type="hidden" />
    <q-field dark :error="$v.form.name.$error" error-label="¡El campo es requerido!">
      <q-input dark v-model="form.name" float-label="Antojo" @blur="$v.form.name.$touch" />
    </q-field>
    <q-field dark :error="$v.form.place.$error" error-label="¡El campo es requerido!">
      <q-input dark v-model="form.place" float-label="Lugar" @blur="$v.form.place.$touch" :error="$v.form.place.$error" />
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
        id: '',
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
  created () {
    var self = this
    var antojitos = self.$db.ref('antojitos')
    antojitos.child(self.$route.params.id).once('value', function (snapshot) {
      self.form = snapshot.val()
      self.form.id = self.$route.params.id
    })
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
      antojitos.child(self.form.id).update({
        name: self.form.name,
        date: Date(),
        place: self.form.place,
        success: false
      })
      self.$q.notify({ message: 'Se ha actualizado el antojito satisfactoriamente.', color: 'secondary' })
      self.$router.push({ name: 'list_antojitos' })
    }
  }
}
</script>

<style>
</style>
