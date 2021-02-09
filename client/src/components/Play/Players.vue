<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col>
        <v-row justify="center" align="center" class="players">
          <v-icon color="white">mdi-account</v-icon>
          <p class="players-tittle">Jugadores</p>
        </v-row>
        <v-row justify="center" align="center" class="players">
          <v-col class="players-content">
            <v-row
              v-for="(p, i) in playersList"
              :key="i"
              justify="space-around"
              :class="p.turn && 'players-specific'"
            >
              <p>{{p.id}}</p>
              <p>{{p.name}}</p>
              <p>{{p.points}}</p>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "players",
  components: {
  },
  props: {
    playersList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    };
  },
  computed: {
	},
  methods: {
	},
  mounted() {
  },
};
</script>

<style scoped>
.players {
  color: white;
}

.players-tittle {
  margin: 0;
  margin-left: 20px;
}

.players-content {
  margin-top: 20px;
  background-color:rgba(0, 0, 0, 0.2);
  width: 100%;
  padding-top: 20px;
}

.players-specific {
  font-weight: bold;
}
</style>
