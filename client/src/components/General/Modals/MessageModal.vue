<template>
  <v-dialog v-model="showModal" persistent max-width="fit-content">
    <v-card class="text-center">
      <v-card-title
        class="headline justify-center py-6 word-break modal-title"
        >{{ title }}</v-card-title
      >
      <v-card-text class="word-break">{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="text-justify primary--text"
          color="secondary"
          dark
          @click="okAction"
          >{{ ok }}</v-btn
        >
      </v-card-actions>
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
  },
  methods: {
    okAction() {
      this.$emit("okAction");
    },
    keyUp(event) {
      if (this.showModal && event.keyCode === 13) {
        // Enter
        this.okAction();
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
