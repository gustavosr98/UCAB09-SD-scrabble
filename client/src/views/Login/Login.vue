<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center">
      <v-col>
        Login
        <btn @click="juego()">Juego</btn> 
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import routes from "@/router/routes";

export default {
  name: "login",
  methods:{
    juego(){this.$router.push("/client/play")}
  }
};
</script>

<style scoped></style>
