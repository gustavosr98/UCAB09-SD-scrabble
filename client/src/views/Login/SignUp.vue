<template>
  <v-container fluid fill-height>
    <v-row class="justify-center">
      <v-col cols="12" xs="12" sm="12" md="4">
        <v-img src="@/assets/Brand/Logo_Full.png"></v-img>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" xs="12" sm="5" md="3">
        <v-form ref="form">
          <v-text-field
            v-model="fullName"
            autofocus
            @keyup.enter="register"
            dark
            color="white"
            required
            class="border"
            label="Nombre completo"
            maxLength="100"
            outlined
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            v-model="user"
            :rules="userRules"
            @keyup.enter="register"
            dark
            color="white"
            class="border"
            label="Usuario"
            maxLength="50"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Nueva contraseña"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="passwordRules"
            @keyup.enter="register"
            maxLength="100"
            class="border mt-1"
            dark
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Confirmar contraseña"
            :type="showConfirmPassword ? 'text' : 'password'"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showConfirmPassword = !showConfirmPassword"
            :rules="repeatPasswordRules"
            @keyup.enter="register"
            maxLength="100"
            class="border mt-1"
            dark
            outlined
            required
          ></v-text-field>

          <v-btn
            @click="goToLoginPage"
            class="mt-10 cancel-button primary--text"
            block
            medium
          >Cancelar</v-btn>
          <v-btn
            @click="register"
            class="mt-2 primary--text"
            block
            medium
            color="light"
            :loading="loading"
            @keyup.enter="register"
          >Registrar</v-btn>
        </v-form>
      </v-col>
    <MessageModal
      :showModal="registrationSuccessfull"
      title="¡Registro exitoso!"
      message="El usuario ha sido creado exitosamente"
      @okAction="closeMessageModal"
    />
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
import MessageModal from "@/components/General/Modals/MessageModal.vue";

export default {
  name: "sign-up",
  components: {
    MessageModal,
  },
  data() {
    return {
      user: "",
      fullName: "",
      nameRules: [
        v => !!v || "Debes introducir tu nombre completo",
      ],
      userRules: [
        v => !!v || "Debes introducir el usuario",
      ],
      password: "",
      confirmPassword: "",
      passwordRules: [
        v => !!v || "Debes introducir la contraseña",
        v =>
          (v && v.length >= 8) ||
          "La contraseña debe tener al menos 8 caracteres",
      ],
      repeatPasswordRules: [
        v => !!v || "Debes introducir la contraseña",
        v => (v === this.password) || "Las contraseñas deben coincidir",
      ],
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      registrationSuccessfull: false,
    };
  },
  mounted() {
    this.setBackgroundDark({ value: true });
  },
  methods: {
    ...mapMutations("ux", ["setBackgroundDark"]),
    goToLoginPage() {
      this.$router.push({ name: "Login" });
    },
    async register() {
      if (this.$refs.form.validate()) {
        const user = {
          fullName: this.fullName,
          username: this.user,
          password: this.confirmPassword,
        };
        this.loading = true;
        await this.$store.dispatch("users/register", user);
        this.loading = false;
        let error = this.$store.getters["users/get"]("error");
        if (error == "") {
          this.registrationSuccessfull = true;
          setTimeout(() => {
            this.registrationSuccessfull = false;
            this.$router.push({ name: "Login" });
          }, 10000);
        }
      }
    },
    closeMessageModal() {
      this.registrationSuccessfull = false;
      this.$router.push({ name: "Login" });
    }
  },
};
</script>

<style scoped>

.border /deep/ fieldset {
  border: 2px solid white;
}

.letters {
  color: white;
  cursor: pointer;
}

.cancel-button {
  background-color: #bbbdbf !important;
}
</style>
