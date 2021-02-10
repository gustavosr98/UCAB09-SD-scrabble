<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col>
        <v-row justify="center" align="center">
          <h1
            class="timer"
            :class="{
              'red--text': $store.state.game.timer.time < 60,
              'yellow--text':
                $store.state.game.timer.time > 60 &&
                $store.state.game.timer.time < 120,
            }"
          >
            {{ prettyTime | prettify }}
          </h1>
          <v-icon large color="white">mdi-clock-time-four</v-icon>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "timer",
  components: {},
  props: {},
  data() {
    return {
      minutes: 0,
      seconds: 0,
    };
  },
  computed: {
    prettyTime() {
      let time = this.$store.state.game.timer.time / 60;
      let minutes = parseInt(time);
      let secondes = Math.round((time - minutes) * 60);
      return minutes + ":" + secondes;
    },
  },
  methods: {},
  filters: {
    prettify(value) {
      let data = value.split(":");
      let minutes = data[0];
      let secondes = data[1];
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (secondes < 10) {
        secondes = "0" + secondes;
      }
      return minutes + ":" + secondes;
    },
  },
  mounted() {},
};
</script>

<style scoped>
.timer {
  font-family: monospace;
  color: white;
  margin-right: 20px;
}
</style>
