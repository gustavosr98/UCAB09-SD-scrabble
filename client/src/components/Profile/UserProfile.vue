<template>
  <v-container fluid fill-height>
    <v-row class="my-10 justify-center">
      <h2>Perfil</h2>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" xs="12" sm="12" md="7">
        <v-form ref="form">
          <v-text-field
            v-model="fullName"
            autofocus
            @keyup.enter="updateProfile"
            color="primary"
            required
            label="Nombre completo"
            maxLength="100"
            outlined
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            v-model="user"
            :rules="userRules"
            @keyup.enter="updateProfile"
            disabled
            color="primary"
            class="border"
            label="Usuario"
            maxLength="50"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Nueva contraseña"
            color="primary"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="passwordRules"
            @keyup.enter="updateProfile"
            maxLength="100"
            class="border mt-1"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Confirmar contraseña"
            color="primary"
            :type="showConfirmPassword ? 'text' : 'password'"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showConfirmPassword = !showConfirmPassword"
            :rules="repeatPasswordRules"
            @keyup.enter="updateProfile"
            maxLength="100"
            class="border mt-1"
            outlined
            required
          ></v-text-field>
          <v-btn
            @click="updateProfile"
            @keyup.enter="updateProfile"
            :loading="loading"
            class="mt-10 primary white--text"
            block
            medium
          >Actualizar</v-btn>
          <v-btn
            @click="deleteAccount"
            class="mt-2 white--text"
            block
            medium
            color="red"
          >Eliminar</v-btn>
        </v-form>
      </v-col>
      <MessageModal
        :showModal="actionExecutedSuccessfully"
        :title="modalTitle"
        :message="modalMessage"
        @okAction="closeMessageModal"
      />
    </v-row>
  </v-container>
</template>

<script>
import MessageModal from "@/components/General/Modals/MessageModal.vue";

export default {
  name: "user-profile",
  components: {
    MessageModal,
  },
  data() {
    return {
      userId: 0,
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
      actionExecutedSuccessfully: false,
      modalTitle: "",
      modalMessage: "",
    };
  },
  mounted() {
    this.setUserData();
  },
  methods: {
    setUserData() {
      const user = this.$store.getters["users/get"]("user");
      this.user = user ? user.username : 'N/D';
      this.fullName = user ? user.fullName : 'N/D';
      this.password = "";
      this.confirmPassword = "";
      this.userId = user ? user.id : 0;
    },
    async updateProfile() {
      if (this.$refs.form.validate()) {
        const user = {
          id: this.$store.getters["users/get"]("user").id,
          fullName: this.fullName,
          username: this.user,
          password: this.confirmPassword,
        };
        this.loading = true;
        await this.$store.dispatch("users/updateProfile", user);
        this.loading = false;
        let error = this.$store.getters["users/get"]("error");
        if (error == "") {
          this.setUserData();
          this.modalTitle = "¡Modificación de perfil exitosa!";
          this.modalMessage = "La información asociada a su perfil de usuario ha sido modificada exitosamente";
          this.actionExecutedSuccessfully = true;
          setTimeout(() => {
            this.actionExecutedSuccessfully = false;
          }, 10000);
        }
      }
    },
    async deleteAccount() {
      this.loading = true;
      await this.$store.dispatch("users/deleteAccount", this.$store.getters["users/get"]("user").id);
      this.loading = false;
      let error = this.$store.getters["users/get"]("error");
      if (error == "") {
        this.modalTitle = "¡Eliminación de cuenta exitosa!";
        this.modalMessage = "Su usuario ha sido eliminado exitosamente. ¡Hasta luego!";
        this.actionExecutedSuccessfully = true;
        setTimeout(() => {
          this.actionExecutedSuccessfully = false;
          this.$router.push({ name: "Login" });
        }, 3000);
      }
    },
    closeMessageModal() {
      this.actionExecutedSuccessfully = false;
    }
  },
};
</script>

<style scoped>

.border /deep/ fieldset {
  border: 2px solid #106836;
}

.letters {
  color: white;
  cursor: pointer;
}

</style>


