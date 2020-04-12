<template>
  <div class="header-container">
    <div class="header-container__title">
      <section class="hero is-light">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              COVID-19
            </h1>
            <h2 class="subtitle">Situación actual en España ({{ formattedDate }})</h2>
          </div>
          <div class="container-mobile">
            <h5 class="title is-5">
              COVID-19
            </h5>
            <label>({{ formattedDate }})</label>
          </div>
        </div>
      </section>
    </div>
    <div class="header-container__summary" v-if="dataLoaded">
      <span class="mdi mdi-biohazard highlight-ico"></span>
      <b-tooltip label="Casos confirmados acumulados" type="is-dark" position="is-left">
        <label class="highlight-data"> {{ formatNumbers(todayData.casos) }} (+{{ casesDifference }})</label></b-tooltip
      >

      <span class="mdi mdi-heart highlight-ico"></span>
      <b-tooltip label="Personas curadas acumuladas" type="is-dark" position="is-left">
        <label class="highlight-data"> {{ formatNumbers(todayData.altas) }} (+{{ recoveredDifference }})</label>
      </b-tooltip>

      <span class="mdi mdi-grave-stone highlight-ico"></span>
      <b-tooltip label="Personas fallecidas acumuladas" type="is-dark" position="is-left">
        <label class="highlight-data"> {{ formatNumbers(todayData.fallecimientos) }} (+{{ deathsDifference }})</label>
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
      return Object.keys(this.todayData).length > 0 && Object.keys(this.yesterdayData).length > 0;
    },
    formattedDate() {
      return this.todayData.fecha !== "" ? new Date(this.todayData.fecha).toLocaleString("es-ES", {}).slice(0, 10) : "";
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
        this.setData(parsedData.data[parsedData.data.length - 1], parsedData.data[parsedData.data.length - 2]);
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
<style lang="scss">
.container {
  display: none;
  border-right: 1px solid #333;
}

.header-container {
  display: grid;
  grid-template-columns: 1fr;
  background-color: #f5f5f5;
  padding-left: 1rem;
  &__title {
    display: none;
  }
  &__summary {
    display: flex;
    align-items: center;
    color: black;
    justify-content: center;
  }
}

.header-container h1 {
  color: #ffffff;
}

.highlight-data {
  font-size: 1rem;
  margin: 0.5rem;
  margin-right: 1rem;
}
.highlight-ico {
  font-size: 40px;
}

/* Non-mobile styles, 750px breakpoint */
@media only screen and (min-width: $breakpoint-movilToTablet) {
  .header-container {
    display: grid;
    grid-template-columns: 0.3fr 1fr;
    background-color: #f5f5f5;
    &__title {
      display: contents;
    }
    &__summary {
      display: flex;
      align-items: center;
      color: black;
      justify-content: center;
    }
  }

}

/* Non-mobile styles, 750px breakpoint */
@media only screen and (min-width: $breakpoint-tabletToDesktop) {
  .container {
    display: contents;
    border-right: 1px solid #333;
  }
  .container-mobile {
    display: none;
  }

  .title {
    font-size: 2.5rem;
  }

  .header-container {
    display: grid;
    grid-template-columns: 0.4fr 1fr;
    border-bottom: 1px solid grey;
    &__title {
    }
    &__summary {
      display: flex;
      align-items: center;
      color: black;
      background-color: #f5f5f5;
      justify-content: center;
    }
  }

  .header-container h1 {
    color: #ffffff;
  }

  .highlight-data {
    font-size: 3rem;
    margin: 1rem;
    margin-right: 3rem;
  }
  .highlight-ico {
    font-size: 40px;
  }
}
</style>
