<template>
  <v-container fluid class="moves">
    <v-row justify="center" align="center">
      <v-icon color="white">mdi-replay</v-icon>
      <p class="ml-5 mb-0">Palabras y Puntos</p>
    </v-row>
    <v-row justify="center" align="center" class="mt-5">
      <v-col class="moves-content pt-5">
        <v-row v-for="(m, i) in movesList" :key="i" justify="space-around">
          <p class="mb-1">{{ m.alias }}</p>
          <p class="mb-1">{{ m.words }}</p>
          <p class="mb-1">{{ m.points }}</p>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "moves",
  props: {
    movesList: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.moves {
  color: white;
}

.moves-content {
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100px;
  overflow-y: auto;
}
</style>
