<template>
  <v-container class="games-table">
    <v-row justify="space-around" class="pt-0">
      <v-col cols="12" sm="3" class="pl-0 mt-10">
        <h2 class="font-weight-light d-flex justify-start">Lista de Salas</h2>
      </v-col>
      <v-col cols="12" sm="5" class="d-flex align-end justify-end">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          append-icon="mdi-close"
          @click:append="search = ''"
          label="Buscar"
          single-line
          hide-details
          class="d-flex inline"
        ></v-text-field>
        <v-btn
          @click="refreshContent"
          class="mx-2"
          x-small
          fab
        >
          <v-icon dark color="primary">mdi-refresh</v-icon>
        </v-btn>
        <v-btn
          @click="showDialog(true)"
          class="mx-2"
          x-small
          fab
          dark
          color="primary"
        >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-5">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :loading="loading"
          no-data-text="No hay salas activas en la aplicación"
          class="elevation-1 px-0"
          :options.sync="options"
          :server-items-length="count"
        >
          <template v-slot:[`item.private`]="{ item }">
            <v-btn v-if="item.private" icon color="light" x-small>
              <v-icon>mdi-lock</v-icon>
            </v-btn>
          </template>
          <template v-slot:[`item.access`]="{ item }">
            <v-btn color="primary" dark @click="accessGame(item)" x-small>
              <v-icon dark>mdi-door</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <PlayFormModal
      :showModal="createDialog"
      @showDialog="showDialog"
    />
  </v-container>
</template>

<script>
import PlayFormModal from "./PlayFormModal.vue";
import { mapMutations } from "vuex";

export default {
  name: "play-table",
  components: {
    PlayFormModal
  },
  data() {
    return {
      loading: false,
      createDialog: false,
      items: [],
      search: "",
      limit: 10,
      page: 1,
      headers: [
        { text: "Identificador", value: "id", align: "center" },
        { text: "Creador", value: "host", align: "center" },
        { text: "En la sala (Max. 4)", value: "totalUsersPlaying", align: "center", },
        { text: "Privado", value: "private", align: "center" },
        { text: "Entrar", align: "start", sortable: false, value: "access" },
      ],
      count: 0,
      options: {},
    }
  },
  methods: {
    ...mapMutations("ux", ["setBackgroundDark"]),
    async refreshContent() {
      this.search = "";
      this.limit = 10;
      this.page = 1;
      await this.loadGames();
    },
    async loadGames() {
      this.loading = true;

      const { page, itemsPerPage } = this.options;

      await this.$store.dispatch("games/getMany", { limit: page * itemsPerPage, page: (page - 1) * itemsPerPage });

      const games = this.$store.getters["games/get"]("games");

      if (games.data) {
        this.count = games.count
        this.items = games.data.map((game) => {
          const hostFound = game.userGames.find((userGame) => userGame.isHost === true);
          
          let host = hostFound ? hostFound.user.username : 'N/D';
          
          return {
            id: game.id,
            host,
            totalUsersPlaying: game.userGames.length,
            private: !!game.accessPassword,
            access: true,
          }
        });
  
        this.loading = false;
      }
    },
    async showDialog(value) {
      this.createDialog = value;
      await this.loadGames();
    },
    async accessGame(game) {
      const userGames = {
        totalPoints: 0,
        isHost: false,
        user: {
          id: this.$store.getters["users/get"]("user").id,
        },
        game: {
          id: game.id
        }  
      }
      await this.$store.dispatch("games/createUserGame", userGames);

      this.$store.commit("games/set", { key: "game", value: game });
      this.$router.push({ name: "Game" });
    },
    async validateGame() {
      const userGame = await this.$store.dispatch("users/getGamesByUser", {id: this.$store.getters["users/get"]("user").id})
      if (userGame) {
        this.$store.commit("games/set", { key: "game", value: userGame.userGames[0].game });
        this.$router.push({ name: "Game" });
      }
    }
  },
  watch: {
    options: {
      async handler() {
        await this.loadGames(); 
      },
      deep: true,
    },
  },
  async mounted() {
    await this.validateGame()
    await this.loadGames();
  },
  created() {
    this.setBackgroundDark({value: false})
  }
};
</script>

<style scope>
.games-table {
  background-color: white;
}
.rounded-corner {
  border-radius: 10px;
}
.refresh-icon {
  background-color: #bbbdbf !important;
}
</style>