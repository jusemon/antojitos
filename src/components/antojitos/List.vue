<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <q-list highlight>
      <q-list-header>Todos los antojitos</q-list-header>
      <q-item v-for="(antojito, index, num) in antojitos" :key="index">
        <q-item-side :avatar="antojito.user.photoURL" />
        <q-item-main>
          <q-item-tile label>{{antojito.name}}</q-item-tile>
          <q-item-tile sublabel>{{antojito.description}}</q-item-tile>
        </q-item-main>
        <q-item-side right icon="more_vert">
          <q-popover ref="popover">
            <q-list link>
              <q-item @click="update(index)">
                <q-item-main label="Editar" />
              </q-item>
              <q-item @click="remove(index, num)">
                <q-item-main label="Eliminar" />
              </q-item>
            </q-list>
          </q-popover>
        </q-item-side>
      </q-item>
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
import { QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile, QBtn, QIcon, QPopover, Toast } from 'quasar'
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
    remove (id, num) {
      var self = this
      self.$refs.popover[num].close()
      var antojitos = self.$db.ref('antojitos')
      antojitos.child(id).remove()
      Toast.create('Se ha eliminado el antojito satisfactoriamente.')
    }
  },
  components: {
    QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile, QBtn, QIcon, QPopover
  }
}
</script>

<style>
</style>
