<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <q-list highlight >
      <q-list-header>Todos los antojitos</q-list-header>
      <template v-for="(antojito, index) in antojitos">
        <q-item-separator />
        <q-item @click="showActionSheet(index, antojito)"  :key="index">
          <q-item-side :avatar="antojito.user.photoURL" />
          <q-item-main>
            <q-item-tile label>{{antojito.name}}</q-item-tile>
            <q-item-tile sublabel>{{antojito.place}}</q-item-tile>
          </q-item-main>
          <q-item-side right :stamp="ago(antojito.date)" />
        </q-item>
      </template>
    </q-list>
    <q-btn
      round
      color="primary"
      @click="create"
      class="fixed"
      style="right: 18px; bottom: 18px"
    >
      <q-icon name="add" />
    </q-btn>
  </div>
</template>

<script>
import { QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile, QBtn, QIcon, QPopover, QItemSeparator, Toast, Dialog, ActionSheet } from 'quasar'
export default {
  data () {
    return {
      antojitos: []
    }
  },
  created () {
    var self = this
    var antojitos = self.$db.ref('antojitos')
    antojitos.on('value', function (snapshot) {
      self.antojitos = snapshot.val()
    })
  },
  beforeDestroy () {
    var self = this
    var antojitos = self.$db.ref('antojitos')
    antojitos.off('value')
  },
  methods: {
    create () {
      this.$router.push({name: 'create_antojito'})
    },
    update (id) {
      this.$router.push({name: 'update_antojito', params: {id: id}})
    },
    remove (id) {
      var self = this
      Dialog.create({
        title: '¡Atención!',
        message: '¿Seguro que deseas borrar el antojito?',
        buttons: [
          'Cancelar',
          {
            label: 'Eliminar',
            handler () {
              var antojitos = self.$db.ref('antojitos')
              antojitos.child(id).remove()
              Toast.create('Se ha eliminado el antojito satisfactoriamente.')
            }
          }
        ]
      })
    },
    checkAsSuccess (id) {
      var self = this
      Dialog.create({
        title: '¡Atención!',
        message: '¿Seguro que deseas marcar como cumplido el antojito?',
        buttons: [
          'Cancelar',
          {
            label: '¡Totalmente!',
            handler () {
              var antojitos = self.$db.ref('antojitos')
              antojitos.child(id).update({
                success: true
              })
              Toast.create('¡Se ha cumplido el antojito!')
            }
          }
        ]
      })
    },
    ago (date) {
      var current = new Date()
      date = new Date(date)
      var hasBeenPassed = (current.getTime() - date.getTime()) / 1000 / 60
      var use = ''
      if (hasBeenPassed < 1) {
        return 'Hace menos de un minuto'
      }
      if (hasBeenPassed < 60) {
        use = 'minuto'
      }
      else {
        hasBeenPassed = hasBeenPassed / 60
        if (hasBeenPassed < 60) {
          use = 'hora'
        }
        else {
          hasBeenPassed = hasBeenPassed / 24
          use = 'día'
        }
      }
      hasBeenPassed = parseInt(hasBeenPassed)
      use = hasBeenPassed > 1 ? use + 's' : use
      return 'Hace ' + hasBeenPassed + ' ' + use
    },
    showActionSheet (id, antojo) {
      if (antojo.success) {
        return
      }
      var self = this
      ActionSheet.create({
        title: 'Acciones',
        // specify ONLY IF you want gallery mode:
        actions: [
          {
            label: '¡Cumplido!',
            icon: 'favorite', // specify ONLY IF using icon
            handler: () => self.checkAsSuccess(id)
          },
          {
            label: 'Editar',
            icon: 'edit', // specify ONLY IF using icon
            handler: () => self.update(id)
          },
          {
            label: 'Eliminar',
            icon: 'delete',
            handler: () => self.remove(id)
          }
        ]
      })
    }
  },
  components: {
    QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile, QBtn, QIcon, QPopover, QItemSeparator
  }
}
</script>

<style>
</style>
