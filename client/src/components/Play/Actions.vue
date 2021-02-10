<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col>
        <v-row justify="center">
          <v-icon color="white">mdi-send-outline</v-icon>
          <v-col cols="10">
            <v-btn block @click="sendMove()">Enviar Jugada</v-btn>
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

export default {
  name: "actions",
  components: {
  },
  props: {
  },
  data() {
    return {
      allowGoOut: true
    };
  },
  computed: {
	},
  methods: {
    sendMove() {
      this.$emit("sendMove");
    },
    take() {},
    pass() {},
    goOut() {
      this.$router.push({ name: "Play" });
    }
	},
  mounted() {
  },
};
</script>

<style scoped>
</style>
