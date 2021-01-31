<template>
  <!-- Vertical Nav Bar  -->
  <v-navigation-drawer
    v-model="openDrawer"
    :mini-variant="!openDrawer && !$vuetify.breakpoint.smAndDown"
    :app="$vuetify.breakpoint.mdAndUp"
    :clipped="$vuetify.breakpoint.mdAndUp"
    :permanent="$vuetify.breakpoint.mdAndUp"
    :absolute="$vuetify.breakpoint.smAndDown"
    :bottom="$vuetify.breakpoint.smAndDown"
    :temporary="$vuetify.breakpoint.smAndDown"
    class="navigation-drawer navigation-drawer-border"
  >
    <!-- Nav Options  -->
    <v-list nav dense class="pa-0">
      <v-list-item-group mandatory v-model="currentOption">
        <v-list-item
          v-for="(navModule, index) in navigationModules"
          :key="navModule.routeName"
          @click="changeRoute(navModule.routeName, navModule.name)"
          class="lisItem mb-0 py-3"
          :class="
            index == currentOption
              ? $vuetify.breakpoint.smAndDown
                ? 'listItemActiveSm'
                : 'listItemActive'
              : $vuetify.breakpoint.smAndDown
              ? 'listItemNotActiveSm'
              : 'listItemNotActive'
          "
        >
          <v-list-item-icon class="pl-2">
            <v-icon v-text="navModule.mdiIcon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>{{ navModule.name }}</v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <!-- Loggout button  -->
    <v-list nav dense class="pa-0">
      <v-list-item-group>
        <v-list-item class="lisItem mb-0 py-3" @click="logOut()">
          <v-list-item-icon class="pl-2">
            <v-icon v-text="'mdi-logout'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>Cerrar sesión</v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import jwt from "@/common/jwt.service";
import { mapMutations } from "vuex";

export default {
  name: "sidebar",
  props: {
    bgDefaultDark: {
      type: Boolean,
      required: false,
      default: false,
    },
    drawer: {
      type: Boolean,
      required: true,
    },
    navigationModules: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentOption: 0,
      sectionName: this.navigationModules[0].name,
    };
  },
  computed: {
    openDrawer: {
      //getter
      get: function() {
        return this.drawer;
      },
      // setter
      set: function(newValue) {
        if (this.drawer || !newValue) {
          this.$emit("toggleDrawer", newValue);
        }
      },
    },
  },
  methods: {
    ...mapMutations("ux", ["setBackgroundDark"]),
    changeRoute(option, sectionName) {
      if (this.sectionName !== sectionName) {
        this.setBackgroundDark({ value: this.bgDefaultDark });
        this.$router.push({ name: `${option}` });
        this.sectionName = sectionName;
        this.setCurrentSectionName(this.sectionName);
      }
    },
    async logOut() {
      jwt.destroyToken();
      await this.$store.dispatch("users/logOut");
      this.$store.dispatch("reset");
      this.$router.push("/");
    },
    setCurrentSectionName(sectionName) {
      this.$emit("setSectionName", sectionName);
    },
    setCurrentOption() {
      let option = this.navigationModules.findIndex(option => {
        return (
          this.$router.currentRoute.meta.app_section === option.app_section
        );
      });
      if (option != -1) {
        this.currentOption = option;
        this.setCurrentSectionName(
          this.navigationModules[this.currentOption].name
        );
      }
    },
  },
  watch: {
    $route() {
      this.setCurrentOption();
    },
  },
  async mounted() {
    this.setCurrentOption();
  },
};
</script>

<style scoped>
.v-item {
  color: var(--v-primary-base);
}
.v-item--active {
  color: var(--v-secondary-base);
}
.listItemActive::after {
  content: "";
  height: 100%;
  position: absolute;
  width: 2.8px;
  top: 0%;
  right: 0%;
  transform: rotate(0deg);
  background-color: var(--v-secondary-base);
  transition: heigth 0.3s, transform 0.3s;
}
.listItemNotActive::after {
  content: "";
  height: 0%;
  position: absolute;
  width: 0%;
  top: 0%;
  right: 0%;
  transform: rotate(180deg);
  background-color: var(--v-secondary-base);
  transition: heigth 0.3s, width 0.3s, transform 0.3s;
}
.listItemActiveSm::after {
  content: "";
  min-height: 2.8px !important;
  position: absolute;
  width: 100%;
  bottom: 0%;
  right: 0%;
  transform: scaleX(1);
  padding-left: 0px;
  background-color: var(--v-secondary-base);
}
.listItemNotActiveSm::after {
  content: "";
  min-height: 2.8px !important;
  position: absolute;
  width: 100%;
  top: 0%;
  right: 0%;
  transform: scaleX(0);
  background-color: var(--v-secondary-base);
  transition: heigth 0.3s, width 0.3s, transform 0.3s;
}
.lisItem {
  border-radius: 0px;
}
.navigation-drawer {
  -webkit-box-shadow: -12px 0px 22px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -12px 0px 22px 0px rgba(0, 0, 0, 0.75);
  box-shadow: -12px 0px 22px 0px rgba(0, 0, 0, 0.75);
  position: fixed;
}
.navigation-drawer-border /deep/ .v-navigation-drawer__border {
  display: none;
}

@media print {
  .navigation-drawer {
    visibility: hidden;
  }
}
</style>
