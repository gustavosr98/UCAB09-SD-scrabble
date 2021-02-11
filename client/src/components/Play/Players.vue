<template>
  <v-container fluid class="players">
    <v-row justify="center" align="center">
      <v-icon color="white">mdi-account</v-icon>
      <p class="ml-5 mb-0">Jugadores</p>
    </v-row>
    <v-row justify="center" align="center" class="mt-5">
      <v-col class="players-content pt-5" :if="playersList">
        <v-row
          v-for="(p, i) in playersList"
          :key="i"
          justify="space-around"
          :class="{ 'red--text': p.wasKickedOut, 'player-with-turn': p.turn }"
          class="players-items"
        >
          <p class="mb-1">{{ p.idGame }}</p>
          <p class="mb-1">{{ p.username }}</p>
          <p class="mb-1">{{ p.score }}</p>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "players",
  props: {
    playersList: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.players {
  color: white;
}

.players-content {
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
}

.players-items {
  font-weight: lighter;
}

.player-with-turn {
  font-weight: bold;
  text-decoration: underline;
  text-decoration-color: white;
}
</style>
