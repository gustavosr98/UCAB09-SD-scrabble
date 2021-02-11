<template>
  <v-container fluid fill-height>
    <v-row class="my-10 justify-center">
      <h2>Estadísticas</h2>
    </v-row>
    <v-row class="justify-center">
      <apexchart
        type="pie"
        :options="chartOptions"
        :series="chartSeries"
      ></apexchart>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" xs="12" sm="12" md="7">
        <v-text-field
          v-model="ranking"
          color="primary"
          class="ranking--border"
          readonly
          label="Ranking"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="bestGame"
          readonly
          color="primary"
          class="best-game-points--border"
          label="Mejor partida"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="points"
          label="Puntos"
          color="primary"
          class="best-game-points--border mt-1"
          outlined
          readonly
        ></v-text-field>
        <v-text-field
          v-model="gamesWon"
          label="Ganadas"
          color="primary"
          class="games-won--border mt-1"
          outlined
          readonly
        ></v-text-field>
        <v-text-field
          v-model="gamesLost"
          label="Perdidas"
          color="primary"
          class="games-lost--border mt-1"
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "user-game-history",
  data() {
    return {
      chartSeries: [],
      numberOfLostGames: 0,
      ranking: "",
      bestGame: "",
      points: "",
      gamesWon: "",
      gamesLost: "",
    };
  },
  async mounted() {
    try {
      await this.$store.dispatch("users/getUserGameStatistics", this.$store.getters["users/get"]("user").id);
    
      this.ranking = this.$store.getters["users/get"]("gameStatistics").ranking[0].ranking;
      this.bestGame = `${this.$store.getters["users/get"]("gameStatistics").bestGame[0].totalpoints} puntos`;
      this.points = this.$store.getters["users/get"]("gameStatistics").totalAccumulatedPoints[0].totalaccumulatedpoints;
      
      const gamesWonPercentage = this.$store.getters["users/get"]("gameStatistics").gamesWon[0].gameswon * 100 /
        (parseInt(this.$store.getters["users/get"]("gameStatistics").gamesWon[0].gameswon) + parseInt(this.$store.getters["users/get"]("gameStatistics").gamesLost[0].gameslost));

      this.gamesWon = `${this.$store.getters["users/get"]("gameStatistics").gamesWon[0].gameswon} (${gamesWonPercentage}%)`;
      
      const gamesLostPercentage = this.$store.getters["users/get"]("gameStatistics").gamesLost[0].gameslost * 100 /
        (parseInt(this.$store.getters["users/get"]("gameStatistics").gamesWon[0].gameswon) + parseInt(this.$store.getters["users/get"]("gameStatistics").gamesLost[0].gameslost));
      
      this.gamesLost = `${this.$store.getters["users/get"]("gameStatistics").gamesLost[0].gameslost} (${gamesLostPercentage}%)`;

      this.chartSeries = [parseInt(this.$store.getters["users/get"]("gameStatistics").gamesWon[0].gameswon), 
        parseInt(this.$store.getters["users/get"]("gameStatistics").gamesLost[0].gameslost)];
    } catch(e) {
      // Nada por el momento...
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          width: 100,
          type: "pie",
        },
        plotOptions: {
          pie: {
            startAngle: -45,
            donut: {
              labels: {
                name: {
                  show: false,
                },
                value: {
                  show: true,
                },
                total: {
                  show: false,
                },
              },
            },
          },
        },
        colors: ['#336bc4', '#c72c18'],
        fill: {
          type: "gradient",
        },
        labels: ['Ganadas', 'Perdidas'],
        responsive: [
          {
            breakpoint: 3000,
            options: {
              chart: {
                height: 200,
              },
              legend: {
                show: false,
              },
            },
          },
          {
            breakpoint: 625,
            options: {
              chart: {
                height: 300,
              },
              legend: {
                show: false,
              },
            },
          },
          {
            breakpoint: 600,
            options: {
              chart: {
                height: 200,
              },
              legend: {
                show: false,
              },
            },
          },
        ],
      };
    },
  }
};
</script>

<style scoped>

.ranking--border /deep/ fieldset {
  border: 2px solid #336bc4;
}

.best-game-points--border /deep/ fieldset {
  border: 2px solid #FFC107;
}

.games-won--border /deep/ fieldset {
  border: 2px solid #106836;
}

.games-lost--border /deep/ fieldset {
  border: 2px solid #ba4030;
}

.letters {
  color: white;
  cursor: pointer;
}

</style>