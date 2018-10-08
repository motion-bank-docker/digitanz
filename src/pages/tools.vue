<template lang="pug">
  q-page
    q-list.no-border.q-mt-md.row
      .column.items-center.q-mb-xs.col-xs-6.col-md-2
        q-btn.q-ma-xs(@click.native="$router.push('/sequences/create')", color="grey-9", round, size="xl")
          q-icon(name="extension", size="xl")
        p Sequenz
      .column.items-center.q-mb-xs.col-xs-6.col-md-2
        q-btn.q-ma-xs(@click.native="$router.push('/mr-griddle')", color="grey-9", round, size="xl")
          q-icon(name="accessibility", size="xl")
        p Form
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(style="opacity: 0.2")
        q-btn.q-ma-xs(round, size="xl", disabled)
          q-icon(name="timer", size="xl")
        p Rhytmus
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(style="opacity: 0.2")
        q-btn.q-ma-xs(round, size="xl", disabled)
          q-icon(name="group", size="xl")
        p Raum
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(style="opacity: 0.2")
        q-btn.q-ma-xs(round, size="xl", disabled)
          q-icon(name="stars", size="xl")
        p ...
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(style="opacity: 0.2")
        q-btn.q-ma-xs(round, size="xl", disabled)
          q-icon(name="stars", size="xl")
        p ...
</template>

<script>
  export default {
  }
</script>
