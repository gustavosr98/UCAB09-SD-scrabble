<template>
  <v-dialog :value="!!errorMessage" persistent width="450px">
    <v-card color="white">
      <v-toolbar
        light
        class="headline d-flex justify-center"
        style="background-color: #eb655e;"
      >
        <v-icon x-large color="white">mdi-alert</v-icon>
      </v-toolbar>
      <v-card-text class="mt-2 font-weight-bold text-center word-break">{{
        errorMessage
      }}</v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn outlined color="#eb655e" dark @click="clearLastError"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { ERROR_CODES } from "@/config/constants";

export default {
  name: "error-modal",
  methods: mapMutations("http", ["clearLastError"]),
  computed: {
    ...mapState("http", ["lastError"]),
    errorMessage() {
      if (this.lastError?.message) {
        return (
          ERROR_CODES[this.lastError.status] || ERROR_CODES.SERVER_ERROR
        );
      } else {
        return this.lastError?.message;
      }
    },
  },
};
</script>

<style scoped>
.word-break {
  word-break: break-word !important;
}
</style>
