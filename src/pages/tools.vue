<template lang="pug">
  q-page
    q-list.no-border.q-mt-sm.row
      .column.items-center.q-mb-xs.col-12
        q-btn.q-ma-xs(@click.native="$router.push('/upload')", round, color="amber-5", outline, size="xl")
          q-icon(name="cloud_upload", outline, color="amber-5", size="xl")
        p Upload
      .column.items-center.q-mb-xs.col-xs-6.col-md-2
        q-btn.q-ma-xs(@click.native="$router.push('/sequences')", round, color="light-green-5", size="xl")
          q-icon(name="extension", size="xl")
        p Choreographie
      .column.items-center.q-mb-xs.col-xs-6.col-md-2
        q-btn.q-ma-xs(@click.native="$router.push('/mr-griddle')", round, color="lime-5", size="xl")
          q-icon(name="accessibility", size="xl")
        p Form
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(style="opacity: 0.2")
        q-btn.q-ma-xs(round, color="deep-orange-5", size="xl", disabled)
          q-icon(name="timer", size="xl")
        p Rhytmus
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(style="opacity: 0.2")
        q-btn.q-ma-xs(round, color="orange-5", size="xl", disabled)
          q-icon(name="group", size="xl")
        p Raum
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(style="opacity: 0.2")
        q-btn.q-ma-xs(round, color="teal-5", size="xl", disabled)
          q-icon(name="stars", size="xl")
        p ...
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(style="opacity: 0.2")
        q-btn.q-ma-xs(round, color="indigo-5", size="xl", disabled)
          q-icon(name="stars", size="xl")
        p ...
</template>

<script>
  export default {
  }
</script>
