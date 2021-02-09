<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col>
        <v-btn block @click="sendMove()">Enviar Jugada</v-btn>
        <v-btn block @click="take()">Tomar Fichas</v-btn>
        <v-btn block @click="pass()">Pasar</v-btn>
        <v-btn block @click="goOut()" :disabled="!allowGoOut">Salir</v-btn>
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
	},
  mounted() {
  },
};
</script>

<style scoped>
</style>
