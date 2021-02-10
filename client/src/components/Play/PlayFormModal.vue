<template>
  <v-dialog v-model="showModal" persistent max-width="fit-content">
    <v-card class="text-center">
      <v-card-actions class="headline primary justify-center py-6 word-break white--text modal-title">
        <v-spacer></v-spacer>
        <h3 >Crear Sala</h3>
        <v-spacer></v-spacer>
        <v-btn @click="cancelAction" class="mr-4" icon dark color="grey">
          <v-icon dark color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
      <v-spacer />
      <v-card-text class="mt-5 word-break">¿Desea establecer una contraseña en la sala? (Opcional)</v-card-text>
      <v-row class="justify-center">
        <v-col cols="12" xs="12" sm="5" md="10">
          <v-text-field
            v-model="accessPassword"
            autofocus
            @keyup.enter="create"
            required
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            class="border"
            label="Contraseña de sala"
            maxLength="50"
            outlined
          ></v-text-field>
          
          <v-btn
            class="text-justify white--text my-5"
            color="primary"
            dark
            block
            :loading="loading"
            @click="create"
            >Crear</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { STATUS } from "@/config/constants.js";

export default {
  props: {
    showModal: { type: Boolean, required: true },
  },
  data() {
    return {
      accessPassword: null,
      loading: false,
      showPassword: false,
    }
  },
  methods: {
    async create() {
      this.loading = true;
      const game = { 
        accessPassword: this.accessPassword,
        userGames: [
          {
            totalPoints: 0,
            isHost: true,
            user: {
              id: this.$store.getters["users/get"]("user").id,
            }  
          }
        ],
        status: { 
          id: STATUS.CREATED 
        },
      }
      await this.$store.dispatch("games/create", game);
      this.loading = false;
      this.$emit("showDialog", false);
      this.$router.push({ name: "Game" });
    },
    cancelAction() {
      this.accessPassword = null
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
