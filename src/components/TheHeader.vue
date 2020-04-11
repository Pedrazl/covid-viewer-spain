<template>
  <div class="header">
    <div class="header__title">
      <section class="hero is-light">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              COVID-19
            </h1>
            <h2 class="subtitle">
              Situación actual en España ({{ formattedDate }})
            </h2>
          </div>
        </div>
      </section>
    </div>
    <div class="header__summary" v-if="dataLoaded">
      <span class="mdi mdi-biohazard highlight-ico"></span>
      <b-tooltip
        label="Casos confirmados acumulados"
        type="is-dark"
        position="is-left"
      >
        <label class="highlight-data">
          {{ formatNumbers(todayData.casos) }} (+{{ casesDifference }})</label
        ></b-tooltip
      >

      <span class="mdi mdi-heart highlight-ico"></span>
      <b-tooltip
        label="Personas curadas acumuladas"
        type="is-dark"
        position="is-left"
      >
        <label class="highlight-data">
          {{ formatNumbers(todayData.altas) }} (+{{
            recoveredDifference
          }})</label
        >
      </b-tooltip>

      <span class="mdi mdi-grave-stone highlight-ico"></span>
      <b-tooltip
        label="Personas fallecidas acumuladas"
        type="is-dark"
        position="is-left"
      >
        <label class="highlight-data">
          {{ formatNumbers(todayData.fallecimientos) }} (+{{
            deathsDifference
          }})</label
        >
      </b-tooltip>
    </div>
  </div>
</template>
<script>
import { getNationalData } from "@/api/datadista.js";

export default {
  data() {
    return {
      todayData: {},
      yesterdayData: {}
    };
  },
  computed: {
    dataLoaded() {
      return (
        Object.keys(this.todayData).length > 0 &&
        Object.keys(this.yesterdayData).length > 0
      );
    },
    formattedDate() {
      return this.todayData.fecha !== ""
        ? new Date(this.todayData.fecha).toLocaleString("es-ES", {}).slice(0, 10)
        : "";
    },
    casesDifference() {
      return this.todayData.casos - this.yesterdayData.casos;
    },
    recoveredDifference() {
      return this.todayData.altas - this.yesterdayData.altas;
    },
    deathsDifference() {
      return this.todayData.fallecimientos - this.yesterdayData.fallecimientos;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.loadCovidNationalData();
    },
    async loadCovidNationalData() {
      try {
        var parsedData = await getNationalData();
        this.setData(
          parsedData.data[parsedData.data.length - 1],
          parsedData.data[parsedData.data.length - 2]
        );
        console.log(parsedData);
      } catch (err) {
        console.log(err);
      }
    },
    setData(todayData, yesterdayData) {
      this.todayData = todayData;
      this.yesterdayData = yesterdayData;
    },
    formatNumbers(number) {
      return Number(number).toLocaleString("es-ES", {});
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  border-right: 1px solid #333;
}

.title {
  font-size: 2.5rem;
}

.header {
  display: grid;
  grid-template-columns: 0.4fr 1fr;
  border-bottom: 1px solid grey;
  &__summary {
    display: flex;
    align-items: center;
    color: black;
    background-color: #f5f5f5;
    justify-content: center;
  }
}

.header h1 {
  color: #ffffff;
}

.highlight-data {
  font-size: 3.5rem;
  margin: 1rem;
  margin-right: 3rem;
}
.highlight-ico {
  font-size: 40px;
}
</style>
