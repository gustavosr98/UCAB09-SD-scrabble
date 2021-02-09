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
        <v-btn @click="create">create node</v-btn>
        <v-btn @click="setData">set value</v-btn>
        <v-btn @click="getData">get value</v-btn>
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
    return { key: null, value: null, zkClient };
  },
  mounted() {},
  methods: {
    create() {
      zkClient.create(this.key);
    },
    setData() {
      zkClient.setData(this.key, { value: this.value });
    },
    getData() {
      console.log(zkClient.getData(this.key));
    },
  },
};
</script>

<style scoped></style>
