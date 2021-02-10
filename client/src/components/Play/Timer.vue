<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col>
        <v-row justify="center" align="center">
		      <h1 class="timer">{{ prettyTime | prettify }}</h1>
          <v-icon large color="white">mdi-clock-time-four</v-icon>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "timer",
  components: {
  },
  props: {
  },
  data() {
    return {
		  isRunning: false,
      minutes: 0,
      seconds: 0,
      time: 300,
		  timer: null,
    };
  },
  computed: {
		prettyTime () {
      let time = this.time / 60
      let minutes = parseInt(time)
      let secondes = Math.round((time - minutes) * 60)
      return minutes + ":" + secondes
		}
	},
  methods: {
    start() {
      this.isRunning = true
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.time > 0) {
            this.time --
          } else {
            clearInterval(this.timer)
            this.reset()
          }
        }, 1000 )
      }
    },
    stop () {
      this.isRunning = false
      clearInterval(this.timer)
      this.timer = null
    },
    reset () {
      this.stop()
      this.time = 0
      this.secondes = 0
      this.minutes = 0
    },
	},
  filters: {
    prettify(value) {
      let data = value.split(':')
      let minutes = data[0]
      let secondes = data[1]
      if (minutes < 10) {
        minutes = "0" + minutes
      }
      if (secondes < 10) {
        secondes = "0" + secondes
      }
      return minutes + ":" + secondes
    }
	},
  mounted() {
  },
};
</script>

<style scoped>
.timer {
  font-weight: bold;
  color: white;
  margin-right: 20px;
}
</style>
