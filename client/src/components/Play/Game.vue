<template>
  <v-container fluid color="primary">
    <v-row justify="center" align="center">
      <v-col cols="4">
        <v-row justify="center">
          <v-col cols="10">
            <v-img :src="logo" alt="Logo" class="game-logo" />
          </v-col>
        </v-row>
        <v-row justify="center">
          <timer />
        </v-row>
        <v-row justify="center">
          <players :playersList="playersList" />
        </v-row>
      </v-col>
      <v-col cols="8">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LogoFull from "@/assets/Brand/Logo_Full.png";
import Timer from "@/components/Play/Timer";
import Players from "@/components/Play/Players";

import { mapMutations } from "vuex";

export default {
  name: "game",
  components: {
    "timer": Timer,
    "players": Players
  },
  props: {
  },
  data() {
    return {
      logo: LogoFull,
      playersList: [
        {
          id: 'P1',
          name: 'jav',
          points: 12,
          turn: true
        },
        {
          id: 'P2',
          name: 'juan',
          points: 3,
          turn: false
        },
        {
          id: 'P3',
          name: 'maria',
          points: 12,
          turn: false
        },
        {
          id: 'P4',
          name: 'pedro',
          points: 2,
          turn: false
        }
      ]
    };
  },
  computed: {
  },
  methods: {
    ...mapMutations("ux", ["setBackgroundDark"]),
  },
  mounted() {
    this.setBackgroundDark({value: true})
  },
};
</script>
<style scoped>
</style>
