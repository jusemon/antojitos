<template>
  <q-page padding class="padding-bottom bg-grey-2">
    <div class="bottom">
      <q-input
        v-model="message"
        style="z-index: 10;"
        type="textarea"
        :max-height="100"
        rows="1"
      />
    </div>
    <q-chat-message
      v-for="(message, index) in messages"
      :key="index"
      :name="message.user.name"
      :avatar="message.user.photoURL"
      :text="[message.text]"
      :sent="message.user.id == $auth.currentUser.uid"
      :stamp="stamp(message.date)"
    />
    <q-btn :disabled="message.length==0" round color="primary" @click="sendMessage" class="fixed" style="right: 18px; bottom: 18px">
      <q-icon name="send" />
    </q-btn>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      connection: null,
      messages: [],
      message: ''
    }
  },
  mounted () {
    var self = this
    self.connection = self.$db.ref('messages')
    self.$q.loading.show()
    self.connection.on('value', function (snapshot) {
      self.messages = snapshot.val()
      setTimeout(() => {
        self.scrollDown()
      }, 10)
      self.$q.loading.hide()
    })
  },
  beforeDestroy () {
    var self = this
    self.connection.off('value')
  },
  methods: {
    sendMessage () {
      var self = this
      var message = {
        text: self.message,
        date: Date(),
        user: {
          id: self.$auth.currentUser.uid,
          photoURL: self.$auth.currentUser.photoURL,
          name: self.$auth.currentUser.displayName
        }
      }
      self.connection.push(message)
      self.message = ''
    },
    scrollDown () {
      var element = document.getElementsByClassName('padding-bottom')[0]
      window.scrollTo(0, element.scrollHeight)
    },
    stamp (date) {
      var self = this
      return self.$utils.stamp(date)
    }
  }
}
</script>

<style>
.bottom {
  position: fixed;
  width: calc(100% - 80px);
  bottom: 10px;
  z-index: 500;
  background: white;
  padding: 10px;
  border-radius: 10px;
}
.padding-bottom{
  padding-bottom: 80px
}
@media (min-width: 1200px) {
  .bottom {
    width: calc(100% - 140px);
  }
}
</style>
