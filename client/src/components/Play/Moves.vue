<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col>
        <div>mdi-replay</div>
        <div>Jugadas</div>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col>
        <div></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "moves",
  components: {
  },
  props: {
    movesList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    };
  },
  computed: {
	},
  methods: {
	},
  mounted() {
  },
};
</script>

<style scoped>
</style>
