<template lang="pug">
  div
    // confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")
    mr-griddle-list-view(
    v-if="griddleSequences.length > 0",
    layout-style='sm',
    :buttonsNew="buttonsNew",
    :buttonsNewDropdown="buttonsNewDropdown",
    :items="griddleSequences")

      template(slot="customButtons", slot-scope="{ item }")
      //
        q-btn(flat, size="sm" round, :icon="getItemStyle(item).icon", :color="getItemStyle(item).color",
        @click="toggleItemFavorite(item)")

        q-btn(flat, size="sm", round, icon="edit",
        @click="$router.push(`/mr-griddle/${item.target.id.split('/').pop()}/edit`)")

        q-btn(flat, size="sm", round, icon="delete",
        @click="openDeleteModal(item)")

    .text-center.q-pb-md(v-else)
      loading-spinner

</template>

<script>
  import ConfirmModal from '../ConfirmModal'
  import LoadingSpinner from '../LoadingSpinner'
  import MrGriddleListView from '../MrGriddleListView'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ConfirmModal,
      LoadingSpinner,
      MrGriddleListView
    },
    data () {
      return {
        buttonsNew: [{
          icon: 'chat',
          label: 'response'
        }],
        favoriteSequences: [],
        griddleSequences: [],
        responses: {},
        sequences: []
      }
    },
    mounted () {
      this.loadData()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      user (val) {
        if (val) this.loadData()
      }
    },
    // TODO dis-fav last item (list returns empty)
    methods: {
      async loadFavorites () {
        // fetch favorite sequences
        // console.log('mmmmmm load favorites ', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        const target = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        if (target) {
          const favAnnotations = await this.$store.dispatch('annotations/find', {
            'target.id': target.id,
            'author.id': this.user.uuid
          })
          this.favoriteSequences = favAnnotations.items
        }
        console.log('### favorite sequences', this.favoriteSequences)
      },
      async toggleItemFavorite (item) {
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === item.target.id
        })
        const message = {
          timeline: item.target.id,
          user: this.user.uuid
        }
        if (favorite) {
          await this.$store.dispatch('annotations/delete', favorite.uuid)
          await this.$store.dispatch('acl/remove', {uuid: favorite.uuid, role: 'digitanz', permission: 'get'})
        }
        else {
          const payload = {
            type: 'MrGriddleFavourite',
            target: {
              type: 'Timeline',
              id: `${process.env.TIMELINE_BASE_URI}${process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID}`
            },
            body: {
              source: {
                id: item.target.id
              },
              type: 'Timeline',
              purpose: 'linking'
            }
          }
          const fav = await this.$store.dispatch('annotations/post', payload)
          if (fav) {
            await this.$store.dispatch('acl/set', {uuid: fav.uuid, role: 'digitanz', permissions: ['get']})
          }
          await this.$store.dispatch('logging/log', { action: 'griddle_sequence_favourite_set', message })
        }
        // await this.loadFavorites()
      },
      getItemStyle (item) {
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === item.target.id
        })
        if (favorite) {
          return {
            color: 'primary',
            icon: 'favorite'
          }
        }
        return {
          color: 'grey-5',
          icon: 'favorite_outline'
        }
      },
      async loadData () {
        /* const target = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        console.log('target:::::', target) */
        /* if (target) {
          const favAnnotations = await this.$store.dispatch('annotations/find', {
            'target.id': target.id,
            'author.id': this.user.uuid
          })
          this.favoriteSequences = favAnnotations.items
        }
        console.log('------------', this.favoriteSequences) */
        const map = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        const annotations = await this.$store.dispatch('annotations/find', {
          'target.id': map.id,
          'body.purpose': 'linking'
        })
        const sequenceIds = annotations.items.map(a => {
          return a.body.source.id.split('/').pop()
        })
        let sequences = []
        let sequenceAnnotations = []
        let sequenceResponses = {}
        for (let seqId of sequenceIds) {
          try {
            const seqMap = await this.$store.dispatch('maps/get', seqId)
            sequences.push(seqMap)
            const seqAnnot = await this.$store.dispatch('annotations/find', {
              'target.id': seqMap.id
            })
            const seqPreview = seqAnnot.items[0]
            sequenceAnnotations.push(seqPreview)
            const seqAnnotResp = await this.$store.dispatch('annotations/find', {
              'target.id': seqMap.id,
              'target.type': 'Timeline',
              'body.purpose': 'commenting'
            })
            sequenceResponses[seqMap.id] = seqAnnotResp.items.length
          }
          catch (e) {
            // TODO fix orphaned annotations
          }
        }
        this.griddleSequences = sequences
        this.griddlePreviews = sequenceAnnotations
        this.responses = sequenceResponses
        console.log(this.griddleSequences)
        console.log(this.griddlePreviews)
        console.log(this.responses)
        /*
        if (!this.user) return
        // get (private) griddles for this user
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const maps = await this.$store.dispatch('maps/find', query)
        const griddleSequences = maps.items.filter(m => {
          return m.title.indexOf('GriddleSequence ') === 0
        })
        let sequenceAnnotations = []
        for (let seq of griddleSequences) {
          const annotations = await this.$store.dispatch('annotations/find', {
            'target.id': seq.id
          })
          sequenceAnnotations.push(annotations.items[0])
        }
        this.sequences = sequenceAnnotations
        // console.log('::::: griddles', this.sequences)
        // await this.loadFavorites()
        */
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteItem (item) {
        this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === item.target.id
        })
        if (favorite) {
          await this.$store.dispatch('annotations/delete', favorite.uuid)
          await this.$store.dispatch('acl/remove', {uuid: favorite.uuid, role: 'digitanz', permission: 'get'})
        }
        await this.$store.dispatch('maps/delete', item.target.id.split('/').pop())
        this.$q.loading.hide()
        await this.loadData()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>

<!--<template lang="pug">
  div

    mr-griddle-list-view(
    v-if="sequences.length > 0",
    layout-style='sm',
    :items="sequences")

      // template(slot="customButtons", slot-scope="{ item }")
      //
        q-btn(flat, size="sm" round, :icon="getItemStyle(item).icon", :color="getItemStyle(item).color",
        @click="toggleItemFavorite(item)")

        q-btn(flat, size="sm", round, icon="edit",
        @click="$router.push(`/mr-griddle/${item.target.id.split('/').pop()}/edit`)")

        q-btn(flat, size="sm", round, icon="delete",
        @click="openDeleteModal(item)")

    .text-center(v-else)
      loading-spinner

</template>

<script>
  import LoadingSpinner from '../LoadingSpinner'
  import MrGriddles from '../MrGriddles'

  export default {
    extends: MrGriddles,
    components: {
      LoadingSpinner
    }
  }
</script>

<style scoped>
</style>
-->
