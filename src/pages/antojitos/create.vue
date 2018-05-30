<template>
  <q-page padding>
    <q-field dark :error="$v.form.name.$error" error-label="¡El campo es requerido!">
      <q-input dark v-model="form.name" float-label="Nombre" @blur="$v.form.name.$touch" />
    </q-field>

    <q-field dark :error="$v.form.place.$error" error-label="¡El campo es requerido!">
      <q-input dark v-model="form.place" float-label="Posible lugar" @blur="$v.form.place.$touch" :error="$v.form.place.$error"
      />
    </q-field>

    <q-field dark>
      <q-uploader ref="files"
        float-label="Imagen del antojito"
        dark
        @add="file_added"
        @remove:abort="file_removed"
        @remove:cancel="file_removed"
        @finish="upload_finish"
        :canUpload="false"
        :autoExpand="true"
        :multiple="true"
        :extensions="allowed_extensions"
        :firebase-storage="upload_file"
      />
    </q-field>

    <q-btn round color="secondary" @click="create" class="fixed" style="right: 18px; bottom: 18px">
      <q-icon name="done" />
    </q-btn>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import QUploader from '../../components/QUploader'

export default {
  data () {
    return {
      form: {
        id: '',
        name: '',
        place: '',
        images: []
      },
      file_queue_count: 0,
      allowed_extensions: '.gif, .jpeg, .png, .jpg'
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
      self.$q.loading.show()
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
      antojitos.push(antojo).then((obj) => {
        if (self.file_queue_count > 0) {
          self.form.id = obj.getKey()
          self.$refs.files.upload()
        } else {
          self.$q.loading.hide()
          self.$q.notify({ message: 'Se ha registrado el antojito satisfactoriamente.', color: 'secondary' })
          self.$router.push({ name: 'list_antojitos' })
        }
      })
    },
    file_added (file) {
      this.file_queue_count = this.file_queue_count + file.length
    },
    file_removed () {
      this.file_queue_count = this.file_queue_count - 1
    },
    upload_file (file) {
      var self = this
      const originalName = file.name
      var image = `${Date.now()}.${file.name}`
      const metadata = {
        customMetadata: {
          originalName
        }
      }
      self.form.images.push(`${self.form.id}/${image}`)
      return self.$storage.ref(`${self.form.id}/${image}`).put(file, metadata)
    },
    upload_finish () {
      var self = this
      var antojitos = self.$db.ref('antojitos')
      antojitos.child(self.form.id).update({
        images: self.form.images
      }).then(() => {
        self.$q.loading.hide()
        self.$q.notify({ message: 'Se ha registrado el antojito satisfactoriamente.', color: 'secondary' })
        self.$router.push({ name: 'list_antojitos' })
      })
    }
  },
  components: { QUploader }
}
</script>

<style>
</style>
