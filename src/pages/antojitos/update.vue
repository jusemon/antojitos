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
    <q-field dark>
      <q-uploader ref="files"
        float-label="Imagen del antojito"
        dark
        v-model="form.files"
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
    <q-card v-for="(image, index ) in form.images" :key="index" inline class="q-ma-sm">
      <q-item>
        <q-item-main>
          <q-item-tile label>{{image.name}}</q-item-tile>
        </q-item-main>
      </q-item>
      <q-card-media>
        <img :src="image.url">
      </q-card-media>
      <q-card-actions>
        <q-btn flat>Eliminar</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import QUploader from '../../components/QUploader'
import Vue from 'vue'
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
  created () {
    var self = this
    self.$q.loading.show()
    var antojitos = self.$db.ref('antojitos')
    antojitos.child(self.$route.params.id).once('value', function (snapshot) {
      self.form = snapshot.val()
      if (typeof self.form.images === 'undefined' || self.form.images.length === 0) {
        self.form.images = []
        self.$q.loading.hide()
      } else {
        for (let index = 0; index < self.form.images.length; index++) {
          self.$storage.ref(self.form.images[index]).getDownloadURL().then((url) => {
            Vue.set(self.form.images, index, { url: url, name: self.getImageName(self.form.images[index]) })
            if (self.form.images.length === index + 1) {
              self.$q.loading.hide()
            }
          })
        }
      }
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
      self.$q.loading.show()
      var antojitos = self.$db.ref('antojitos')
      antojitos.child(self.form.id).update({
        name: self.form.name,
        date: Date(),
        place: self.form.place,
        success: false
      }).then((obj) => {
        if (self.file_queue_count > 0) {
          self.$refs.files.upload()
        } else {
          self.$q.loading.hide()
          self.$q.notify({ message: 'Se ha actualizado el antojito satisfactoriamente.', color: 'secondary' })
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
      console.log(`${self.form.id}/${image}`)
      self.form.images.push(`${self.form.id}/${image}`)
      return self.$storage.ref(`${self.form.id}/${image}`).put(file, metadata)
    },
    upload_finish () {
      var self = this
      var antojitos = self.$db.ref('antojitos')
      console.log(self.form.images)
      antojitos.child(self.form.id).update({
        images: self.form.images
      }).then(() => {
        self.$q.loading.hide()
        self.$q.notify({ message: 'Se ha actualizado el antojito satisfactoriamente.', color: 'secondary' })
        self.$router.push({ name: 'list_antojitos' })
      })
    },
    getImageName (image) {
      var imageParts = image.split('/')
      return image.substr(imageParts[0].length + 1 + imageParts[1].split('.')[0].length + 1)
    }
  },
  components: { QUploader }
}
</script>

<style>
</style>
