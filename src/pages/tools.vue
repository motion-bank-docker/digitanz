<template lang="pug">
  q-page
    q-list.no-border.q-mt-md.row
      .column.items-center.q-mb-md.col-12
        q-btn.q-ma-xs(round, color="amber-5", outline, size="xl")
          q-icon(name="cloud_upload", outline, color="amber-5", size="xl")
        p Upload
      .column.items-center.q-mb-md.col-6
        q-btn.q-ma-xs(round, color="light-green-5", size="xl")
          q-icon(name="extension", size="xl")
        p Choreographie
      .column.items-center.q-mb-md.col-6
        q-btn.q-ma-xs(round, color="lime-5", size="xl")
          q-icon(name="accessibility", size="xl")
        p Form
      .column.items-center.q-mb-sm.col-6
        q-btn.q-ma-xs(round, color="deep-orange-5", size="xl")
          q-icon(name="timer", size="xl")
        p Rhytmus
      .column.items-center.q-mb-sm.col-6
        q-btn.q-ma-xs(round, color="orange-5", size="xl")
          q-icon(name="group", size="xl")
        p Raum
      .column.items-center.q-mb-sm.col-6
        q-btn.q-ma-xs(round, color="teal-5", size="xl")
          q-icon(name="local_pizza", size="xl")
        p Tool-5
      .column.items-center.q-mb-sm.col-6
        q-btn.q-ma-xs(round, color="indigo-5", size="xl")
          q-icon(name="local_florist", size="xl")
        p Tool-6
    //q-list.no-border.no-padding.row
      //
      // VIDEO SEQUENCER
      q-card.col-4(color="light-green-4" style="height: 100px; width: 100px")
        q-card-media.row.justify-around(style="height: 100%")
          griddle-moves(:time="1000")
        //q-card-title(slot="overlay")
            p Mr. Griddle
            span(slot="subtitle")
              Formfindung
      //
      // MR GRIDDLE
      q-card.col-4(color="light-green-4" style="height: 100px; width: 100px")
        q-card-media.row.justify-around(style="height: 100%")
          griddle-moves(:time="1000")
        //q-card-title(slot="overlay")
            p Mr. Griddle
            span(slot="subtitle")
              Formfindung
      //
      // RHYTMUS
      q-card.col-4(color="light-green-4" style="height: 100px; width: 100px")
        q-card-media.row.justify-around(style="height: 100%")
          griddle-moves(:time="1000")
        //q-card-title(slot="overlay")
            p Mr. Griddle
            span(slot="subtitle")
              Formfindung
</template>

<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>
