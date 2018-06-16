<template>
  <div
    class="q-uploader relative-position"
    :class="classes"
    @dragover.prevent.stop="__onDragOver"
  >
    <q-input-frame
      ref="input"

      :prefix="prefix"
      :suffix="suffix"
      :stack-label="stackLabel"
      :float-label="floatLabel"
      :error="error"
      :warning="warning"
      :disable="disable"
      :inverted="inverted"
      :invertedLight="invertedLight"
      :dark="dark"
      :hide-underline="hideUnderline"
      :before="before"
      :after="after"
      :color="color"
      :align="align"
      :no-parent-field="noParentField"

      :length="queueLength"
      additional-length
    >
      <div
        class="col q-input-target ellipsis"
        :class="alignClass"
      >
        {{ label }}
      </div>

      <q-spinner
        v-if="uploading"
        slot="after"
        size="24px"
        class="q-if-end self-center"
      ></q-spinner>

      <q-icon
        v-if="uploading"
        slot="after"
        class="q-if-end self-center"
        :name="$q.icon.uploader[`clear${isInverted ? 'Inverted' : ''}`]"
        @click.native="abort"
      ></q-icon>

      <q-icon
        v-if="!uploading"
        slot="after"
        :name="$q.icon.uploader.add"
        class="q-uploader-pick-button q-if-control relative-position overflow-hidden"
        @click.native="__pick"
        :disabled="addDisabled"
      >
        <input
          type="file"
          ref="file"
          class="q-uploader-input absolute-full cursor-pointer"
          :accept="extensions"
          v-bind.prop="{multiple: multiple}"
          @change="__add"
        >
      </q-icon>

      <q-icon
        v-if="!hideUploadButton && !uploading && canUpload"
        slot="after"
        :name="$q.icon.uploader.upload"
        class="q-if-control"
        :disabled="queueLength === 0"
        @click.native="upload"
      ></q-icon>

      <q-icon
        v-if="hasExpandedContent"
        slot="after"
        :name="$q.icon.uploader.expand"
        class="q-if-control generic_transition"
        :class="{'rotate-180': expanded}"
        @click.native="expanded = !expanded"
      ></q-icon>
    </q-input-frame>

    <q-slide-transition>
      <div v-show="expanded">
        <q-list :dark="dark" class="q-uploader-files q-py-none scroll" :style="filesStyle">
          <q-item
            v-for="file in files"
            :key="file.name + file.__timestamp"
            class="q-uploader-file q-pa-xs"
          >
            <q-progress v-if="!hideUploadProgress"
              class="q-uploader-progress-bg absolute-full"
              :color="file.__failed ? 'negative' : progressColor"
              :percentage="file.__progress"
              height="100%"
            ></q-progress>
            <div class="q-uploader-progress-text absolute" v-if="!hideUploadProgress">
              {{ file.__progress }}%
            </div>

            <q-item-side v-if="file.__img" :image="file.__img.src"></q-item-side>
            <q-item-side v-else :icon="$q.icon.uploader.file" :color="color"></q-item-side>

            <q-item-main :label="file.name" :sublabel="file.__size"></q-item-main>

            <q-item-side right>
              <q-item-tile
                :icon="$q.icon.uploader[file.__doneUploading ? 'done' : 'clear']"
                :color="color"
                class="cursor-pointer"
                @click.native="__remove(file)"
              ></q-item-tile>
            </q-item-side>
          </q-item>
        </q-list>
      </div>
    </q-slide-transition>

    <div
      v-if="dnd"
      class="q-uploader-dnd flex row items-center justify-center absolute-full"
      :class="dndClass"
      @dragenter.prevent.stop
      @dragover.prevent.stop
      @dragleave.prevent.stop="__onDragLeave"
      @drop.prevent.stop="__onDrop"
    ></div>
  </div>
</template>

<script>
import AlignMixin from 'quasar-framework/src/mixins/align'
import { format } from 'quasar'
const { humanStorageSize } = format

function initFile (file) {
  file.__doneUploading = false
  file.__failed = false
  file.__uploaded = 0
  file.__progress = 0
}

const marginal = {
  type: Array,
  validator: v => v.every(i => 'icon' in i)
}

export default {
  name: 'q-uploader',
  mixins: [AlignMixin],
  props: {
    name: {
      type: String,
      default: 'file'
    },
    headers: Object,
    firebaseStorage: {
      type: [Object, Function],
      required: false
    },
    fileFilter: {
      type: Function,
      required: false
    },
    url: {
      type: String,
      required: false
    },
    urlFactory: {
      type: Function,
      required: false
    },
    additionalFields: {
      type: Array,
      default: () => []
    },
    method: {
      type: String,
      default: 'POST'
    },
    canUpload: {
      type: Boolean,
      default: true
    },
    extensions: String,
    multiple: Boolean,
    hideUploadButton: Boolean,
    hideUploadProgress: Boolean,
    noThumbnails: Boolean,
    autoExpand: Boolean,
    expandStyle: [Array, String, Object],
    expandClass: [Array, String, Object],
    sendRaw: {
      type: Boolean,
      default: false
    },
    prefix: String,
    suffix: String,
    stackLabel: String,
    floatLabel: String,
    error: Boolean,
    warning: Boolean,
    disable: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    align: {
      default: 'left'
    },
    dark: Boolean,
    before: marginal,
    after: marginal,
    inverted: Boolean,
    invertedLight: Boolean,
    hideUnderline: Boolean,
    noParentField: Boolean
  },
  data () {
    return {
      queue: [],
      files: [],
      uploading: false,
      uploadedSize: 0,
      totalSize: 0,
      xhrs: [],
      firebaseStorageUploadTasks: [],
      focused: false,
      dnd: false,
      expanded: false
    }
  },
  computed: {
    queueLength () {
      return this.queue.length
    },
    hasExpandedContent () {
      return this.files.length > 0
    },
    label () {
      const total = humanStorageSize(this.totalSize)
      return this.uploading
        ? `${(this.progress).toFixed(2)}% (${humanStorageSize(this.uploadedSize)} / ${total})`
        : `${this.queueLength} (${total})`
    },
    progress () {
      return this.totalSize ? Math.min(99.99, this.uploadedSize / this.totalSize * 100) : 0
    },
    addDisabled () {
      return !this.multiple && this.queueLength >= 1
    },
    filesStyle () {
      if (this.maxHeight) {
        return { maxHeight: this.maxHeight }
      }
    },
    isInverted () {
      return this.inverted || this.invertedLight
    },
    dndClass () {
      const cls = [`text-${this.color}`]
      if (this.isInverted) {
        cls.push('inverted')
      }
      return cls
    },
    classes () {
      return {
        'q-uploader-expanded': this.expanded,
        'q-uploader-dark': this.dark,
        'q-uploader-files-no-border': this.isInverted || !this.hideUnderline
      }
    },
    progressColor () {
      return this.dark ? 'white' : 'grey'
    }
  },
  watch: {
    hasExpandedContent (v) {
      if (v === false) {
        this.expanded = false
      } else if (this.autoExpand) {
        this.expanded = true
      }
    }
  },
  methods: {
    __onDragOver () {
      this.dnd = true
    },
    __onDragLeave () {
      this.dnd = false
    },
    __onDrop (e) {
      this.dnd = false

      const
        files = e.dataTransfer.files,
        count = files.length

      if (count > 0) {
        this.__add(null, this.multiple ? files : [ files[0] ])
      }
    },
    __add (e, files) {
      if (this.addDisabled) {
        return
      }

      files = Array.prototype.slice.call(files || e.target.files)
      // allow filtering the files
      if (typeof this.fileFilter === 'function') {
        const filteredFiles = files.filter(this.fileFilter)
        const amountOfDiscardedFiles = files.length - filteredFiles.length
        if (amountOfDiscardedFiles > 0) {
          this.$emit('filtered', files.filter(file => !~filteredFiles.indexOf(file)))
          files = filteredFiles
        }
      }
      this.$refs.file.value = ''

      let filesReady = [] // List of image load promises
      files = files.filter(file => !this.queue.some(f => file.name === f.name))
        .map(file => {
          initFile(file)
          file.__size = humanStorageSize(file.size)
          file.__timestamp = new Date().getTime()

          if (this.noThumbnails || !file.type.startsWith('image')) {
            this.queue.push(file)
          } else {
            const reader = new FileReader()
            let p = new Promise((resolve, reject) => {
              reader.onload = (e) => {
                let img = new Image()
                img.src = e.target.result
                file.__img = img
                this.queue.push(file)
                this.__computeTotalSize()
                resolve(true)
              }
              reader.onerror = (e) => {
                reject(e)
              }
            })

            reader.readAsDataURL(file)
            filesReady.push(p)
          }

          return file
        })

      if (files.length > 0) {
        this.files = this.files.concat(files)
        Promise.all(filesReady).then(() => {
          this.$emit('add', files)
        })
        this.__computeTotalSize()
      }
    },
    __getFirebaseUploadPromise (file) {
      initFile(file)
      let uploadTask

      // simplest usage : provide a Firebase Storage Ref
      if (typeof this.firebaseStorage === 'object') {
        // Firebase Storage allows custom String props to be written in metadata.customMdetadata
        const metadata = {
          customMetadata: {}
        }
        // We reuse the additionalFields prop to populate metadata
        this.additionalFields.forEach(field => {
          metadata.customMetadata[field.name] = field.value
        })
        uploadTask = this.firebaseStorage.child(file.name).put(file, metadata)
      } else if (typeof this.firebaseStorage === 'function') {
        /* alternative : provide a function that returns a Firebase Storage Ref
         i.e. if the files need to be renamed before upload */
        uploadTask = this.firebaseStorage(file)
      } else {
        return
      }
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', snapshot => {
          // upload in progresss
          if (file.__removed) { return }
          const uploaded = snapshot.bytesTransferred
          this.uploadedSize += uploaded - file.__uploaded
          file.__uploaded = uploaded
          file.__progress = Math.min(99, parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100, 10))
        }, error => {
          // error while uploading
          file.__failed = true
          this.$emit('fail', file, uploadTask, error)
          reject(uploadTask)
        }, () => {
          // upload successful
          file.__doneUploading = true
          file.__progress = 100
          this.$emit('uploaded', file, uploadTask)
          resolve(file)
        })
        this.firebaseStorageUploadTasks.push(uploadTask)
      })
    },
    __computeTotalSize () {
      this.totalSize = this.queueLength
        ? this.queue.map(f => f.size).reduce((total, size) => total + size)
        : 0
    },
    __remove (file) {
      const
        name = file.name,
        done = file.__doneUploading

      if (this.uploading && !done) {
        this.$emit('remove:abort', file, file.xhr)
        file.xhr.abort()
        this.uploadedSize -= file.__uploaded
      } else {
        this.$emit(`remove:${done ? 'done' : 'cancel'}`, file, file.xhr)
      }

      if (!done) {
        this.queue = this.queue.filter(obj => obj.name !== name)
      }

      file.__removed = true
      this.files = this.files.filter(obj => obj.name !== name)
      this.__computeTotalSize()
    },
    __pick () {
      if (!this.addDisabled && this.$q.platform.is.mozilla) {
        this.$refs.file.click()
      }
    },
    __getUploadPromise (file) {
      const
        form = new FormData(),
        xhr = new XMLHttpRequest()

      try {
        this.additionalFields.forEach(field => {
          form.append(field.name, field.value)
        })
        form.append('Content-Type', file.type || 'application/octet-stream')
        form.append(this.name, file)
      } catch (e) {
        return
      }

      initFile(file)
      file.xhr = xhr
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', e => {
          if (file.__removed) { return }
          e.percent = e.total ? e.loaded / e.total : 0
          let uploaded = e.percent * file.size
          this.uploadedSize += uploaded - file.__uploaded
          file.__uploaded = uploaded
          file.__progress = Math.min(99, parseInt(e.percent * 100, 10))
        }, false)

        xhr.onreadystatechange = () => {
          if (xhr.readyState < 4) {
            return
          }
          if (xhr.status && xhr.status < 400) {
            file.__doneUploading = true
            file.__progress = 100
            this.$emit('uploaded', file, xhr)
            resolve(file)
          } else {
            file.__failed = true
            this.$emit('fail', file, xhr)
            reject(xhr)
          }
        }

        xhr.onerror = () => {
          file.__failed = true
          this.$emit('fail', file, xhr)
          reject(xhr)
        }

        const resolver = this.urlFactory
          ? this.urlFactory(file)
          : Promise.resolve(this.url)

        resolver.then(url => {
          xhr.open(this.method, url, true)
          if (this.headers) {
            Object.keys(this.headers).forEach(key => {
              xhr.setRequestHeader(key, this.headers[key])
            })
          }

          this.xhrs.push(xhr)
          if (this.sendRaw) {
            xhr.send(file)
          } else {
            xhr.send(form)
          }
        })
      })
    },
    pick () {
      if (!this.addDisabled) {
        this.$refs.file.click()
      }
    },
    upload () {
      const length = this.queueLength
      if (this.disable || length === 0) {
        return
      }

      let filesDone = 0
      this.uploadedSize = 0
      this.uploading = true
      this.xhrs = []
      this.firebaseStorageUploadTasks = []
      this.$emit('start')

      let solved = () => {
        filesDone++
        if (filesDone === length) {
          this.uploading = false
          this.xhrs = []
          this.firebaseStorageUploadTasks = []
          this.queue = this.queue.filter(f => !f.__doneUploading)
          this.__computeTotalSize()
          this.$emit('finish')
        }
      }

      // we need to figure out if we're using 'url' or 'Firebase' method
      const { url, firebaseStorage } = this
      if (url) {
        this.queue.map(file => this.__getUploadPromise(file))
          .forEach(promise => {
            promise.then(solved).catch(solved)
          })
      } else if (firebaseStorage) {
        this.queue.map(file => this.__getFirebaseUploadPromise(file))
          .forEach(promise => {
            promise.then(solved).catch(solved)
          })
      }
    },
    abort () {
      this.xhrs.forEach(xhr => { xhr.abort() })
      this.firebaseStorageUploadTasks.forEach(uploadTask => { uploadTask.cancel() })
    },
    reset () {
      this.abort()
      this.files = []
      this.queue = []
      this.expanded = false
      this.__computeTotalSize()
      this.$emit('reset')
    }
  }
}
</script>
