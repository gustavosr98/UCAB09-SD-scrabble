<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center">
      <v-col>
        <ranking-table />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RankingTable from "@/components/Ranking/RankingTable.vue"

export default {
  name: "ranking",
  components: {
    "ranking-table": RankingTable
  }

};
</script>

<style scoped></style>
