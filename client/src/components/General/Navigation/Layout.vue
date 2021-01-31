<template>
  <div>
    <navbar
      :sectionName="sectionName"
      :drawer="drawer"
      @toggleDrawer="toggleDrawer"
    ></navbar>
    <sidebar
      :navigationModules="navigationModules"
      @toggleDrawer="toggleDrawer"
      :drawer="drawer"
      @setSectionName="setSectionName"
    ></sidebar>
    <router-view class="pl-3 pt-3"></router-view>
  </div>
</template>

<script>
// CORE
import { mapMutations } from "vuex";

// COMPONENTS
import Navbar from "@/components/General/Navigation/Navbar";
import Sidebar from "@/components/General/Navigation/Sidebar";

// CONSTANTS
import { APP_SECTIONS } from "@/config/constants";

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
  },
  data() {
    return {
      sectionName: "",
      drawer: false,
      wasOptionsSelected: false,
      navigationModules: [
        {
          name: "Ranking",
          mdiIcon: "mdi-poll-box",
          routeName: "Ranking",
          app_section: APP_SECTIONS.RANKING,
        },
        {
          name: "Jugar",
          mdiIcon: "mdi-gamepad-variant",
          routeName: "Play",
          app_section: APP_SECTIONS.PLAY,
        },
        {
          name: "Perfil",
          mdiIcon: "mdi-account",
          routeName: "Profile",
          app_section: APP_SECTIONS.PROFILE,
        },
      ],
    };
  },
  methods: {
    ...mapMutations("ux", ["setBackgroundDark"]),
    toggleDrawer(newValue) {
      this.drawer = newValue;
    },
    setSectionName(newValue) {
      this.sectionName = newValue;
    },
  },
  beforeMount() {
    this.setBackgroundDark({ value: false });
  },
};
</script>
