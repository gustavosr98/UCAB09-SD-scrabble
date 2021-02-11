<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col>
        <v-row v-if="isHost" justify="center">
          <v-icon color="white">mdi-play</v-icon>
          <v-col cols="10">
            <v-btn
              block
              @click="startGame()"
              :disabled="isGameInProgress"
              >Empezar juego</v-btn
            >
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-icon color="white">mdi-send-outline</v-icon>
          <v-col cols="10">
            <v-btn block @click="sendMove()" :disabled="!isGameInProgress"
              >Enviar Jugada</v-btn
            >
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-icon color="white">mdi-rectangle</v-icon>
          <v-col cols="10">
            <v-btn block @click="take()">Tomar Fichas</v-btn>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-icon color="white">mdi-skip-next-outline</v-icon>
          <v-col cols="10">
            <v-btn block @click="pass()">Pasar</v-btn>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-icon color="white">mdi-door-open</v-icon>
          <v-col cols="10">
            <v-btn block @click="goOut()" :disabled="!allowGoOut">Salir</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ROOM_STATUS, MOVE_TYPE } from "@/config/constants";
export default {
  name: "actions",
  components: {},
  props: {
    isHost: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      allowGoOut: true,
    };
  },
  computed: {
    isGameInProgress() {
      return this.$store.state.game.status === ROOM_STATUS.IN_PROGRESS;
    },
  },
  methods: {
    sendMove() {
      this.$emit("sendMove");
    },
    startGame(){
      this.$store.dispatch("game/closeDoorAndStartGame");
      this.$emit("startGame");
    },
    take() {},
    pass() {},
    async goOut() {
      await this.$store.dispatch("game/exitRoom");
      this.$router.push({ name: "Play" });
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
