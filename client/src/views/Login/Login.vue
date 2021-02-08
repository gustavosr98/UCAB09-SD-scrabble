<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center">
      <v-col>
        Login
        <v-btn @click="zkClient.create('/a')">create node</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import routes from "@/router/routes";
import { zkClient } from "@/connections/zookeeper/zk-client";

export default {
  name: "login",
  data() {
    return { zkClient };
  },
};
</script>

<style scoped></style>
