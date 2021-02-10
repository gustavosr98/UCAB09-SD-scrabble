<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center">
      <v-col>
        <play-table />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlayTable from "@/components/Play/PlayTable.vue";

export default {
  name: "play",
  components: {
    "play-table": PlayTable,
  },
};
</script>

<style scoped></style>
