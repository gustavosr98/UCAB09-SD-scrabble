<template>
  <v-dialog v-model="showModal" persistent width="450px">
    <v-card color="white">
      <v-toolbar light class="d-flex justify-center secondary">
        <v-icon x-large color="white">mdi-alert</v-icon>
      </v-toolbar>
      <v-card class="text-center word-break">
        <v-card-title class="headline justify-center word-break">{{
          title
        }}</v-card-title>
        <v-card-text class="word-break">{{ message }}</v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="grey" dark @click="cancelAction">{{ cancel }}</v-btn>
          <v-btn
            if="withCancelBtn"
            color="error lighten-1"
            dark
            @click="okAction"
            >{{ ok }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showModal: { type: Boolean, required: true },
    loading: { type: Boolean },
    title: { type: String, required: true },
    message: { type: String, required: true },
    ok: { type: String, required: false, default: "vale" },
    cancel: { type: String, required: false, default: "cancelar" },
    withCancelBtn: { type: Boolean, required: false, default: true },
  },
  methods: {
    okAction() {
      this.$emit("okAction");
    },
    cancelAction() {
      this.$emit("cancelAction");
    },
    keyUp(event) {
      if (this.showModal) {
        if (event.keyCode === 13) {
          // Enter
          this.okAction();
        } else if (event.keyCode === 27) {
          // Esc
          this.cancelAction();
        }
      }
    },
  },
  mounted() {
    window.addEventListener("keyup", this.keyUp);
  },
};
</script>

<style scoped>
.word-break {
  word-break: break-word !important;
}
</style>
