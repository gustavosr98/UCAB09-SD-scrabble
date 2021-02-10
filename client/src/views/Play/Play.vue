<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center">
      <v-col>
        <game />
        <play-table />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Game from "@/components/Play/Game.vue"
import PlayTable from "@/components/Play/PlayTable.vue";

export default {
  name: "play",
  components: {
    "game": Game,
    "play-table": PlayTable,
  },
};
</script>

<style scoped></style>
