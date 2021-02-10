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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "login",
  data() {
    return { key: null, value: null, step: 0 };
  },
  async mounted() {},
  methods: {
    async test() {
      // CREATE ROOM
      const user = {
        id: 1,
        fullname: "Gustavo Sanchez",
        usernme: "gustavosr98",
      };
      await this.$store.dispatch("game/createRoom", {
        roomId: 21,
        user,
      });

      // CLOSE ROOM
      // await this.$store.dispatch("game/closeRoom");
    },
  },
};
</script>

<style scoped></style>
