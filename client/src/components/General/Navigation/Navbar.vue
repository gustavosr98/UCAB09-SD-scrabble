<template>
  <!-- Horizontal App Bar  -->
  <v-app-bar
    app
    class="app-bar z-index"
    color="primary"
    justify="space-between"
    clipped-left
  >
    <v-row
      justify="space-between"
      align="center"
      class="app-bar-container px-3"
    >
      <!-- MENU TOGGLER -->
      <v-col xs="6" sm="4" align="start" class="app-bar-container-item">
        <v-row>
          <v-app-bar-nav-icon
            @click="toggleDrawer()"
            color="white"
            :class="
              !drawer || !$vuetify.breakpoint.mdAndUp
                ? 'menuButtonActive'
                : 'menuButtonNotActive'
            "
          >
            <v-icon medium dark v-if="drawer && $vuetify.breakpoint.mdAndUp"
              >close</v-icon
            >
          </v-app-bar-nav-icon>
        </v-row>
      </v-col>

      <!-- CENTER -->
      <v-col sm="4" align="center" class="app-bar-container-item">
        <v-toolbar-title>
          <v-img :src="logo" alt="Logo" class="app-bar-logo" />
        </v-toolbar-title>
      </v-col>

      <!-- USERNAME -->
      <v-col xs="6" sm="4" align="end" class="app-bar-container-item">
        <v-row justify="end">
          <span v-if="$vuetify.breakpoint.mdAndUp">{{ userName }}</span>
          <v-icon
            medium
            dark
            class="app-bar-user"
            v-if="$vuetify.breakpoint.mdAndUp"
            >account_circle</v-icon
          >
          <v-tooltip bottom v-if="$vuetify.breakpoint.smAndDown">
            <template v-slot:activator="{ on, attrs }">
              <v-icon medium dark class="app-bar-user" v-bind="attrs" v-on="on"
                >account_circle</v-icon
              >
            </template>
            <span>{{ userName }}</span>
          </v-tooltip>
        </v-row>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import jwt from "@/common/jwt.service";
import LogoFull from "@/assets/Brand/Logo_Full.png";

export default {
  name: "navbar",
  props: {
    sectionName: {
      type: String,
      required: true,
    },
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      logo: LogoFull,
    };
  },
  computed: {
    userName() {
      return "@gustavosr98";
    },
  },
  methods: {
    toggleDrawer() {
      this.$emit("toggleDrawer", !this.drawer);
    },
    logOut() {
      jwt.destroyToken();
      this.$store.dispatch("reset");
      this.$router.push("/");
    },
  },
  async mounted() {
    await this.$store.dispatch("users/updateToken");
  },
};
</script>

<style scoped>
.app-bar {
  color: white;
}
.app-bar-container {
  max-height: 100% !important;
}
.app-bar-logo {
  max-width: 200px;
}
.app-bar-container-item {
  height: 100% !important;
  padding: 0px !important;
}
.app-bar-container-logo {
  max-height: 100%;
  width: 70%;
  margin-left: 2%;
}
.app-bar-user {
  margin-left: 2%;
}
.menuButtonActive {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
.menuButtonNotActive {
  transform: rotate(0deg);
  transition: transform 0.3s;
}
.z-index {
  z-index: 30;
}
@media print {
  .app-bar {
    visibility: hidden;
  }
}
</style>
