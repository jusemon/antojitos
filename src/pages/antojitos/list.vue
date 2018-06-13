<template>
  <q-page padding>
    <q-list highlight separator>
      <q-list-header>Todos los antojitos</q-list-header>
      <q-item v-for="(antojito, index) in antojitos" @click.native="showActionSheet(index, antojito)" :key="index">
        <q-item-side :avatar="antojito.user.photoURL" />
        <q-item-main>
          <q-item-tile label>{{antojito.name}}</q-item-tile>
          <q-item-tile sublabel>{{antojito.place}}</q-item-tile>
        </q-item-main>
        <q-item-side right :stamp="stamp(antojito.date)" />
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="create" class="fixed" style="right: 18px; bottom: 18px">
      <q-icon name="add" />
    </q-btn>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      antojitos: []
    }
  },
  mounted () {
    var self = this
    var antojitos = self.$db.ref('antojitos')
    self.$q.loading.show()
    antojitos.on('value', function (snapshot) {
      self.antojitos = snapshot.val()
      self.$q.loading.hide()
    })
  },
  beforeDestroy () {
    var self = this
    var antojitos = self.$db.ref('antojitos')
    antojitos.off('value')
  },
  methods: {
    create () {
      this.$router.push({ name: 'create_antojito' })
    },
    update (id) {
      this.$router.push({ name: 'update_antojito', params: { id: id } })
    },
    remove (id, antojo) {
      var self = this
      self.$q.dialog({
        title: '¡Atención!',
        message: '¿Seguro que deseas borrar el antojito?',
        ok: '¡Si!',
        cancel: 'Mejor no'
      }).then(() => {
        var antojitos = self.$db.ref('antojitos')
        antojitos.child(id).remove().then(() => {
          if (typeof antojo.images !== 'undefined') {
            for (var index = 0; index < antojo.images.length; index++) {
              self.$storage.ref(antojo.images[index]).delete()
            }
          }
          self.$q.notify({ message: 'Se ha eliminado el antojito satisfactoriamente.', color: 'secondary' })
        })
      }).catch(() => { })
    },
    checkAsSuccess (id) {
      var self = this
      self.$q.dialog({
        title: '¡Atención!',
        message: '¿Seguro que deseas marcar como cumplido el antojito?',
        ok: '¡Si!',
        cancel: 'Mejor no'
      }).then(() => {
        var antojitos = self.$db.ref('antojitos')
        antojitos.child(id).update({
          success: true
        })
        self.$q.notify({ message: '¡Se ha cumplido el antojito!', color: 'secondary' })
      }).catch(() => { })
    },
    stamp (date) {
      var self = this
      return self.$utils.stamp(date)
    },
    showActionSheet (id, antojo) {
      if (antojo.success) {
        return
      }
      var self = this
      this.$q.actionSheet({
        title: 'Acciones',
        actions: [
          {
            label: '¡Cumplido!',
            icon: 'favorite',
            handler: () => self.checkAsSuccess(id)
          },
          {
            label: 'Editar',
            icon: 'edit',
            handler: () => self.update(id)
          },
          {
            label: 'Eliminar',
            icon: 'delete',
            handler: () => self.remove(id, antojo)
          }
        ]
      }).catch(() => { })
    }
  }
}
</script>

<style>
</style>
