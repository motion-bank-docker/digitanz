<template lang="pug">
  q-page.flex.column
    video-modal(:show="showVideoModal", :preview="preview", @canceled="showVideoModal = false")
    image-modal(:show="showImageModal", :source="preview", @canceled="showImageModal = false")

    // SORT-BUTTONS
    div.row
      q-btn.q-ma-xs(disable flat dark) Sortieren nach...
    div.row.q-mb-md.no-wrap
      q-btn.q-ma-xs(color="red" icon="date_range" @click="groupedList = groupedDates") Datum
      q-btn.q-ma-xs(color="faded" icon="build" @click="groupedList = groupedTools") Tool
      q-btn.q-ma-xs(color="primary" icon="label" @click="groupedList = groupedTags") Tags

    // MY SAVED ITEMS
    q-list.row.no-border(v-for="(group, index) in groupedList", :key="group.uuid", :title="group.title")
      q-list-header.no-margin {{ index }}
      div.line-separator.full-width
      q-item.q-mb-sm(v-for="(item, index_2) in group" :key="item.uuid", :src="item.media", style="width: 100vw")
        q-item-side.position-relative.self-start
          q-btn.no-padding(@click="openPreview(item)")
            img(:src="item.preview", style="width: 20vw; height: auto")
        q-item-main.q-pl-md.self-end
          //q-item-tile.q-pb-sm {{ item.tool }}
          q-item-tile.no-margin
            q-btn(flat round icon="edit")
            q-btn.q-mx-xs(flat round icon="delete" @click="openDeleteModal()")
            q-btn(flat round icon="cloud_download")
</template>

<script>
  // import path from 'path'
  // import url from 'url'
  import VideoModal from '../components/VideoModal'
  import ImageModal from '../components/ImageModal'
  import DeleteModal from '../components/DeleteModal'
  export default {
    components: {
      VideoModal,
      ImageModal,
      DeleteModal
    },
    data () {
      return {
        groupedList: '',
        showVideoModal: false,
        showImageModal: false,
        showDeleteModal: false,
        savedItems: [
          { uuid: 4,
            created: '2018-01-13T15:45:11+00:00',
            source: 'https://pbs.twimg.com/profile_images/469017630796296193/R-bEN4UP.png',
            tool: 'Mr. Griddle',
            title: '',
            description: '',
            rating: '',
            tags: 'Interessante Bewegungen',
            preview: 'https://pbs.twimg.com/profile_images/469017630796296193/R-bEN4UP.png',
            duration: 10,
            type: 'image/jpeg'
          },
          { uuid: 33,
            created: '2018-01-13T15:46:11+00:00',
            source: 'https://www.schilder-versand.com/assets/gfx/nav/images/verkehrsberuhigung-nach-stvo-106.jpg',
            tool: 'Mr. Griddle',
            title: '',
            description: '',
            rating: '',
            tags: 'Interessante Bewegungen',
            preview: 'https://www.schilder-versand.com/assets/gfx/nav/images/verkehrsberuhigung-nach-stvo-106.jpg',
            duration: 10,
            type: 'image/jpeg'
          },
          { uuid: 34,
            created: '2018-01-13T15:47:11+00:00',
            source: 'https://i.giphy.com/media/xThtagWTA121eTgb5K/giphy.mp4',
            tool: 'Raum',
            title: '',
            description: '',
            rating: '',
            tags: 'Interessante Bewegungen',
            preview: 'https://cdn2.techadvisor.co.uk/cmsdata/features/3511087/how-to-fix-youtube-videos-that-wont-play_thumb800.jpg',
            duration: 10,
            type: 'video/mp4'
          },
          { uuid: 12,
            created: '2018-01-13T15:45:11+00:00',
            source: 'https://asset.re-in.de/isa/160267/c1/-/de/1305655_BB_02_FB/BIG-Traffic-Signs-Verkehrsschilder-Set.jpg?y=525&align=center',
            tool: 'Raum',
            title: '',
            description: '',
            rating: '',
            tags: 'Gruppenchoreo',
            preview: 'https://asset.re-in.de/isa/160267/c1/-/de/1305655_BB_02_FB/BIG-Traffic-Signs-Verkehrsschilder-Set.jpg?y=525&align=center',
            duration: 10,
            type: 'image/jpeg'
          },
          { uuid: 200,
            created: '2018-02-12T15:45:11+00:00',
            source: 'https://i.giphy.com/media/ferYVfmvi2IN5indq1/giphy.mp4',
            tool: 'VideoSequencer',
            title: '',
            description: '',
            rating: '',
            tags: '',
            preview: 'https://www.br.de/br-fernsehen/sendungen/kunst-und-krempel/kunst-krempel-kuh-bild-100~_v-img__16__9__xl_-d31c35f8186ebeb80b0cd843a7c267a0e0c81647.jpg?version=1f3a1',
            duration: 10,
            type: 'video/mp4'
          },
          { uuid: 100,
            created: '2018-02-12T15:45:11+00:00',
            source: 'assets/test_eins.png',
            tool: 'Mr. Griddle',
            title: '',
            description: '',
            rating: '',
            tags: '',
            preview: 'assets/test_eins.png',
            duration: 10,
            type: 'image/jpeg'
          },
          { uuid: 55,
            created: '2018-03-13T15:45:11+00:00',
            source: 'assets/test_eins.png',
            tool: 'Rezepte',
            title: '',
            description: '',
            rating: '',
            tags: '',
            preview: 'assets/test_eins.png',
            duration: 10,
            type: 'image/jpeg'
          }
        ]
      }
    },
    methods: {
      deleteItem (index) {
        this.groupedTools.splice(index, 1)
      },
      groupBy (objectArray, property) {
        return objectArray.reduce(function (acc, obj) {
          let key = obj[property]
          if (property === 'created') key = obj[property].split('T')[0]
          if (!acc[key]) {
            acc[key] = []
          }
          acc[key].push(obj)
          return acc
        }, {})
      },
      openPreview (item) {
        console.log(item)
        if (item.type === 'video/mp4') {
          this.showVideoModal = true
          this.preview = {
            source: {
              id: item.media,
              type: 'video/mp4'
            }
          }
        }
        else if (item.type === 'image/jpeg') {
          this.showImageModal = true
        }
      },
      openDeleteModal () {
        console.log('Hallo')
        this.showDeleteModal = true
      }
    },
    computed: {
      groupedTools () {
        const savedItems = this.savedItems
        return this.groupBy(savedItems.reverse(), 'tool')
      },
      groupedDates () {
        const savedItems = this.savedItems
        return this.groupBy(savedItems.reverse(), 'created')
      },
      groupedTags () {
        const savedItems = this.savedItems
        return this.groupBy(savedItems.reverse(), 'tags')
      }
    },
    async mounted () {
      this.groupedList = this.groupedDates
      console.log('Hallo', this.groupedList)
      /* const _this = this
      this.$store.dispatch('annotations/find', { query: { 'body.type': 'Composite' } }).then(composites => {
        console.log(composites, _this.$store)
        const myComposites = composites.filter(composite => {
          return composite.author === _this.$store.state.auth.payload.userId && composite.body.purpose === 'personal'
        })
        this.savedItems = myComposites.map(comp => {
          const payload = JSON.parse(comp.body.source)
          return {
            tool: 'Video Sequencer',
            created: comp.created,
            preview: payload.preview,
            media: payload.id,
            type: 'video/mp4',
            uuid: comp.uuid
          }
        })
      }) */
    }
  }
</script>

<style scoped>

</style>
