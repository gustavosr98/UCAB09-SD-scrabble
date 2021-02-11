<template>
  <v-container fluid>
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
          <actions
            ref="actions"
            @sendMove="sendMove"
            :isHost="this.userGame.isHost"
          />
        </v-row>
      </v-col>
      <v-col cols="8">
        <board ref="board" />
      </v-col>
    </v-row>
    <!-- MODALS -->
    <warning-modal
      :showModal="!!$store.state.game.error.major"
      title="Error"
      :message="$store.state.game.error.major || ''"
      ok="Vale"
      @okAction="$refs.actions.goOut()"
      :withCancelBtn="false"
    />
  </v-container>
</template>

<script>
import WarningModal from "@/components/General/Modals/WarningModal";
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
    WarningModal,
    timer: Timer,
    players: Players,
    moves: Moves,
    actions: Actions,
    board: Board,
  },
  props: {},
  data() {
    return {
      logo: LogoFull,
      userGame: {},
      game: {},
      user: {},
      gameInfo: {},
      isHost: {},
      playersList: [],
      movesList: [
        {
          id: "P1",
          word: "hola",
          points: 12,
        },
        {
          id: "P2",
          word: "chao",
          points: 3,
        },
        {
          id: "P3",
          word: "prueba",
          points: 12,
        },
        {
          id: "P4",
          word: "copa",
          points: 2,
        },
        {
          id: "P3",
          word: "prueba",
          points: 12,
        },
        {
          id: "P4",
          word: "copa",
          points: 2,
        },
      ],
    };
  },
  methods: {
    ...mapMutations("ux", ["setBackgroundDark"]),

    sendMove() {
      this.$refs.board.validate();
    },
    async findGameInfo() {
      this.userGame = await this.$store.dispatch("users/getUserGame", {
        idUser: this.user.id,
        idGame: this.game.id,
      });
      console.log(this.userGame);
      this.$store.commit("game/set", { key: "userGame", value: this.userGame });
      this.gameInfo = await this.$store.dispatch(
        "games/getGameWithUsers",
        this.game.id
      );
      console.log(this.gameInfo);
      this.setPlayers();
    },
    setPlayers() {
      this.playersList = this.gameInfo.userGames.map((ug, i) => {
        return {
          id: ug.user.id,
          fullName: ug.user.fullName,
          username: ug.user.username,
          idGame: `P${i + 1}`,
          points: ug.totalPoints,
          turn: false,
        };
      });
    },
    async enterRoom() {
      if (this.userGame.isHost) {
        await this.$store.dispatch("game/createRoom", {
          roomId: this.game.id,
          user: this.user,
        });
      } else {
        await this.$store.dispatch("game/enterRoom", {
          roomId: this.game.id,
          user: this.user,
        });
      }
    },
  },
  async mounted() {
    this.setBackgroundDark({ value: true });
    this.user = this.$store.getters["users/get"]("user");
    this.game = this.$store.getters["games/get"]("game");
    console.log(this.user);
    console.log(this.game);
    await this.findGameInfo();
    await this.enterRoom();
  },
};
</script>
<style scoped></style>
