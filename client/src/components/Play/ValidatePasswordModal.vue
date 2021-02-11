<template>
  <v-dialog v-model="showModal" persistent max-width="fit-content">
    <v-card class="text-center">
      <v-card-actions class="headline primary justify-center py-6 word-break white--text modal-title">
        <v-spacer></v-spacer>
        <h3 >Acceder a la Sala</h3>
        <v-spacer></v-spacer>
        <v-btn @click="cancelAction" class="mr-4" icon dark color="grey">
          <v-icon dark color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
      <v-spacer />
      <v-card-text class="mt-5 word-break">Escribe la contraseña para acceder a esta sala</v-card-text>
      <v-row class="justify-center">
        <v-col cols="12" xs="12" sm="5" md="10">
          <v-text-field
            v-model="password"
            autofocus
            @keyup.enter="access"
            required
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="rules"
            class="border"
            label="Contraseña de sala"
            maxLength="50"
            outlined
            ref="form"
          ></v-text-field>
          
          <v-btn
            class="text-justify white--text my-5"
            color="primary"
            dark
            block
            @click="access"
            >Acceder</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showModal: { type: Boolean, required: true },
    accessPassword: { type: String, required: true }
  },
  data() {
    return {
      password: '',
      showPassword: false,
      rules: [
        v => !!v || "Debes introducir la contraseña",
        v => (v === this.accessPassword) || "Contraseña incorrecta",
      ],
    }
  },
  methods: {
    async access() {
      if (this.$refs.form.validate() && this.password === this.accessPassword) {
        this.$emit("redirectToGame");
        this.$emit("showDialog", false);
      }
    },
    cancelAction() {
      this.password = null
      this.$emit("showDialog", false);
    }
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
