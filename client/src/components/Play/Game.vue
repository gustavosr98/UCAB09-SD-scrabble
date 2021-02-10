<template>
  <v-container fluid color="primary">
    <v-row justify="center">
      <v-col cols="4">
        <v-row justify="center" class="mb-7">
          <v-img :src="logo" alt="Logo" class="logo" />
        </v-row>
        <v-row justify="center" class="mb-7">
          <timer ref="timer" />
        </v-row>
        <v-row justify="center" class="mb-7">
          <players :playersList="playersList" />
        </v-row>
        <v-row justify="center" class="mb-7">
          <moves :movesList="movesList" />
        </v-row>
        <v-row justify="center">
          <actions ref="actions" @sendMove="sendMove" />
        </v-row>
      </v-col>
      <v-col cols="8">
        <board ref="board" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LogoFull from "@/assets/Brand/Logo_Full.png";
import Timer from "@/components/Play/Timer";
import Players from "@/components/Play/Players";
import Moves from "@/components/Play/Moves";
import Actions from "@/components/Play/Actions";
import Board from "@/components/Play/Board.vue";

import { mapMutations } from "vuex";

export default {
  name: "game",
  components: {
    "timer": Timer,
    "players": Players,
    "moves": Moves,
    "actions": Actions,
    "board": Board,
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
      ],
      movesList: [
        {
          id: 'P1',
          word: 'hola',
          points: 12,
        },
        {
          id: 'P2',
          word: 'chao',
          points: 3,
        },
        {
          id: 'P3',
          word: 'prueba',
          points: 12,
        },
        {
          id: 'P4',
          word: 'copa',
          points: 2,
        },
        {
          id: 'P3',
          word: 'prueba',
          points: 12,
        },
        {
          id: 'P4',
          word: 'copa',
          points: 2,
        }
      ]
    };
  },
  methods: {
    ...mapMutations("ux", ["setBackgroundDark"]),

    sendMove() {
      this.$refs.board.validate()
    }
  },
  mounted() {
    this.setBackgroundDark({value: true})
    this.$refs.timer.start()

    const game = this.$store.getters["games/get"]("game");
    const user = this.$store.getters["users/get"]("user");
    console.log(game)
    console.log(user)

    this.$store.dispatch("games/getOne", game.id);
  },
};
</script>
<style scoped>
</style>
