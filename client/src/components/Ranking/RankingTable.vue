<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col
        cols="12"
        sm="6"
        :class="
          $vuetify.breakpoint.xsOnly
            ? 'd-flex justify-center'
            : 'd-flex align-end'
        "
      >
        <h2 class="font-weight-light">Ranking</h2>
      </v-col>
      <v-col cols="12" sm="6" class="d-flex align-end justify-end">
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
          clearable
        ></v-text-field>
        <v-btn
          @click="reload"
          class="mx-2"
          x-small
          fab
          dark
        >
          <v-icon dark>mdi-reload</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-row fill-width class="my-2 pa-2">
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        class="elevation-1 pa-2"
        style="width: 100%"
        no-data-text="No hay ranking"
        :options.sync="options"
        :server-items-length="count"
      >
      </v-data-table>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ranking-table",
  components: {
  },
  props: {
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: "Usuario", align: "start", value: "username" },
        { text: "Ranking", value: "ranking" },
        { text: "Puntos", value: "points" },
        { text: "Partidas Ganadas", value: "victories" },
        { text: "Partidas Perdidas", value: "defeats" },
        { text: "Nombre", value: "name" },
      ],
      options: {},
      count: 0,
      users: [],
      search: ''
    };
  },
  methods: {
    async fetchUsers() {
      this.loading = true;

      const { page, itemsPerPage, sortBy, sortDesc } = this.options;

      const fetched = await this.$store.dispatch("users/getRanking", {
        limit: page * itemsPerPage,
        page: (page - 1) * itemsPerPage,
        username: this.search,
      });

      this.users = this.transformUsers((page - 1) * itemsPerPage);
      this.count = this.$store.getters["users/get"]("countRanking")

      this.loading = false;
    },
    transformUsers(page) {
      if (this.$store.getters["users/get"]("ranking").length) {
        const users = this.$store.getters["users/get"]("ranking");
        const usersData = users.map((u, i) => ({
          ranking: (i + 1) + page,
          ...u
        }));
        return usersData
      }
      return [];
    },
    reload() {
      this.fetchUsers()
    }
  },
  watch: {
    options: {
      async handler() {
        await this.fetchUsers();
      },
      deep: true,
    },
    async search() {
      await this.fetchUsers();
    },
  },
  mounted() {
    this.fetchUsers()
  },
};
</script>

<style scoped>
</style>
