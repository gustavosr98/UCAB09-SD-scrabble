<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center">
      <v-col>
        <v-text-field outlined placeholder="key" v-model="key"></v-text-field>
        <v-text-field
          outlined
          placeholder="value"
          v-model="value"
        ></v-text-field>
        <v-btn @click="test">test</v-btn>
        <v-btn @click="createRoom">createRoom</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import routes from "@/router/routes";

export default {
  name: "login",
  data() {
    return { key: null, value: null };
  },
  async mounted() {},
  methods: {
    async test() {
      await this.$store.dispatch("game/connect");
      await this.$store.dispatch("game/exitRoom");
      await this.$store.dispatch("game/connect");
    },
    async createRoom() {
      await this.$store.dispatch("game/createRoom", { roomId: 8, playerId: 1 });
    },
  },
};
</script>

<style scoped></style>
