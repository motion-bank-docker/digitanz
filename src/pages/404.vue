<template>
  <div class="fixed-center text-center dark">
    <p>
      <img src="~assets/sad.png" style="width:30vw;max-width:400px;">
    </p>
    <p class="text-faded"><strong>(404)</strong></p>
    <q-btn
      color="dark"
      style="width:200px;"
      dark
      @click="$router.push('/')"
    >Go back</q-btn>
  </div>
</template>
