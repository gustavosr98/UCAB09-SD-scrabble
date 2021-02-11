<template>
  <v-container class="container" fluid fill-height>
    <v-row class="justify-center primary--text">
      <v-col class="d-flex justify-center" md="6" sm="12">
        <UserProfile/>
      </v-col>
      <v-col class="d-flex justify-center" md="6" sm="12" xs="12">
        <UserGameHistory/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserGameHistory from "@/components/Profile/UserGameHistory.vue";
import UserProfile from "@/components/Profile/UserProfile.vue";

export default {
  name: "profile",
  components: {
    UserGameHistory,
    UserProfile,
  }
};
</script>

<style scoped></style>
