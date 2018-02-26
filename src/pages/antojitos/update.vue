<template>
  <q-page padding>
    <input v-model="form.id" type="hidden" />
    <q-field dark :error="$v.form.name.$error" error-label="¡El campo es requerido!">
      <q-input dark v-model="form.name" float-label="Antojo" @blur="$v.form.name.$touch" />
    </q-field>
    <q-field dark :error="$v.form.place.$error" error-label="¡El campo es requerido!">
      <q-input dark v-model="form.place" float-label="Lugar" @blur="$v.form.place.$touch" :error="$v.form.place.$error" />
    </q-field>
    <q-field dark>
      <q-uploader ref="files"
        float-label="Imagen del antojito"
        dark
        v-model="form.files"
        @add="fileAdded"
        @remove:abort="fileRemoved"
        @remove:cancel="fileRemoved"
        @finish="uploadFinish"
        :canUpload="false"
        :autoExpand="true"
        :multiple="true"
        :extensions="allowedExtensions"
        :firebase-storage="uploadFile"
      />
    </q-field>
    <q-card v-for="(image, index) in form.images" :key="image.key" inline class="q-ma-sm">
      <q-item>
        <q-item-main>
          <q-item-tile label>{{image.name}}</q-item-tile>
        </q-item-main>
      </q-item>
      <q-card-media>
        <img :src="image.url">
      </q-card-media>
      <q-card-actions>
        <q-btn flat @click="deleteFile(index)">Eliminar</q-btn>
      </q-card-actions>
    </q-card>
    <q-btn round color="secondary" @click="create" class="fixed" style="right: 18px; bottom: 18px">
      <q-icon name="done" />
    </q-btn>
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
      fileQueueCount: 0,
      allowedExtensions: '.gif, .jpeg, .png, .jpg'
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
            Vue.set(self.form.images, index, {
              url: url,
              name: self.getImageName(self.form.images[index]),
              key: self.form.images[index]
            })
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
        if (self.fileQueueCount > 0) {
          self.$refs.files.upload()
        } else {
          self.$q.loading.hide()
          self.$q.notify({ message: 'Se ha actualizado el antojito satisfactoriamente.', color: 'secondary' })
          self.$router.push({ name: 'list_antojitos' })
        }
      })
    },
    fileAdded (file) {
      this.fileQueueCount = this.fileQueueCount + file.length
    },
    fileRemoved () {
      this.fileQueueCount = this.fileQueueCount - 1
    },
    uploadFile (file) {
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
    uploadFinish () {
      var self = this
      var antojitos = self.$db.ref('antojitos')
      antojitos.child(self.form.id).update({
        images: self.form.images
      }).then(() => {
        self.$q.loading.hide()
        self.$q.notify({ message: 'Se ha actualizado el antojito satisfactoriamente.', color: 'secondary' })
        self.$router.push({ name: 'list_antojitos' })
      })
    },
    getImageName (key) {
      var imageParts = key.split('/')
      return key.substr(imageParts[0].length + 1 + imageParts[1].split('.')[0].length + 1)
    },
    deleteFile (index) {
      var self = this
      self.$q.loading.show()
      var file = self.form.images[index]
      self.form.images.splice(index, 1)
      self.$storage.ref(file.key).delete().then((res) => {
        var antojitos = self.$db.ref('antojitos')
        antojitos.child(self.form.id).update({
          images: self.form.images
        }).then(() => {
          self.$q.loading.hide()
          self.$q.notify({ message: '¡Oh no! ¡Se ha eliminado la imagen!', color: 'secondary' })
        })
      })
    }
  },
  components: { QUploader }
}
</script>

<style>
</style>
