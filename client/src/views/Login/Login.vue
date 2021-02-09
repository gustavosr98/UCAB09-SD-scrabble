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
            v-model="user"
            :rules="userRules"
            autofocus
            @keyup.enter="login"
            append-icon="mdi-account"
            dark
            color="white"
            class="border"
            label="Usuario"
            maxLength="50"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="passwordRules"
            @keyup.enter="login"
            maxLength="100"
            class="border mt-1"
            dark
            outlined
          ></v-text-field>

          <v-row class="justify-space-between" no-gutters>
            <p/>
            <p class="letters" @click="register">Regístrate</p>
          </v-row>

          <v-btn
            @click="login"
            class="mt-10 primary--text"
            block
            medium
            color="light"
            :loading="loading"
            @keyup.enter="login"
          >Ingresar</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "login",
  data() {
    return {
      user: "",
      userRules: [
        v => !!v || "Debes introducir el usuario",
      ],
      password: "",
      passwordRules: [
        v => !!v || "Debes introducir la contrseña",
        v =>
          (v && v.length >= 8) ||
          "La contraseña debe tener al menos 8 caracteres",
      ],
      showPassword: false,
      loading: false,
    };
  },
  mounted() {
    this.setBackgroundDark({ value: true });
  },
  methods: {
    ...mapMutations("ux", ["setBackgroundDark"]),
    register(){
      this.$router.push({ name: "SignUp" });
    },
    async login() {
      if (this.$refs.form.validate()) {
        const user = {
          username: this.user,
          password: this.password,
        };
        this.loading = true;
        await this.$store.dispatch("users/authorize", user);
        this.loading = false;
        let error = this.$store.getters["users/get"]("error");
        if (error == "") {
          this.$router.push({ name: "Ranking" });
        }
      }
    },
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
</style>
