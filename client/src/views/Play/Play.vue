<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center">
      <v-col>
        <main-board/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MainBoard from "@/components/Play/MainBoard.vue";


export default {
  name: "play",
  components: {
    "main-board": MainBoard,
  }
};
</script>

<style scoped></style>
