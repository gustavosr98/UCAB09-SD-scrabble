<template>
  <v-app>
    <v-content v-bind:class="{ primary: backgroundDark }" height="100%">
      <router-view />
      <error-modal />
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import ErrorModal from "@/components/General/Modals/ErrorModal";

export default {
  name: "App",
  components: {
    "error-modal": ErrorModal,
  },
  computed: {
    ...mapState("ux", ["backgroundDark"]),
  },
  mounted() {},
};
</script>

<style>
/* Global develop class helpers */
.dev-a {
  background: red;
  border: solid 1px blue;
}
.dev-b {
  background: green;
  border: solid 1px purple;
}

.v-application {
  font-family: "Montserrat", sans-serif !important;
}
</style>
