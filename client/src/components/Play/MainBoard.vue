<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center">
      <v-col cols="4">
        MainBoard
      </v-col>
      <v-col cols="8">
        <board/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

import Board from "@/components/Play/Board.vue";

export default {
  name: "main-board",
  components: {
    "board": Board,
  },
  async mounted() {
    this.setBackgroundDark({ value: true });
  },
  methods: {
    ...mapMutations("ux", ["setBackgroundDark"])
  }
};
</script>

<style scoped></style>
