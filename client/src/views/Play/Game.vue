<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center">
      <v-col>
        <game />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Game from "@/components/Play/Game.vue"

export default {
  name: "play",
  components: {
    "game": Game,
  },
};
</script>

<style scoped></style>
