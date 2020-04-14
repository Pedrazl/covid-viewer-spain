<template>
  <div class="header">
    <div class="header__title">
      <section class="header-mobile">
        <h3 class="subtitle is-3">
          COVID-19 <label class="small"> - {{ formattedDate }}-</label>
        </h3>
      </section>
      <section class="hero is-light">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              COVID-19
            </h1>
            <h2 class="subtitle">Situación actual en España ({{ formattedDate }})</h2>
          </div>
        </div>
      </section>
    </div>
    <div class="header__summary" v-if="dataLoaded">
      <span class="mdi mdi-biohazard highlight-ico"></span>
      <b-tooltip label="Casos confirmados acumulados" type="is-dark" position="is-top">
        <label class="highlight-data"> {{ formatNumbers(todayData.casos) }} (+{{ casesDifference }})</label></b-tooltip
      >

      <span class="mdi mdi-heart highlight-ico"></span>
      <b-tooltip label="Personas curadas acumuladas" type="is-dark" position="is-top">
        <label class="highlight-data"> {{ formatNumbers(todayData.altas) }} (+{{ recoveredDifference }})</label>
      </b-tooltip>

      <span class="mdi mdi-grave-stone highlight-ico"></span>
      <b-tooltip label="Personas fallecidas acumuladas" type="is-dark" position="is-top">
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
        var lastDaysData = this.getLastTwoDaysData(parsedData.data);
        this.setData(lastDaysData[0], lastDaysData[1]);
      } catch (err) {
        console.log(err);
      }
    },
    getLastTwoDaysData(serieData){      
      for (let i = serieData.length - 1; i > 0; i--){
        if (serieData[i].fecha !== ""){
          return [serieData[i], serieData[i-1]];
        }     
      }
      return null;
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
.small {
  font-size: 0.9rem;
}

.header {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 50px;
  background-color: #f5f5f5;
  padding-left: 1rem;
  &__title {
    text-align: center;
    padding: 0.5rem;
  }
  &__summary {
    display: flex;
    padding-top: 1rem;
    align-items: center;
    color: black;
    justify-content: center;
  }
}

.hero {
  display: none !important;
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
  .highlight-data {
    font-size: 1.5rem;
    margin: 0.5rem;
    margin-right: 1rem;
  }
}

@media only screen and (min-width: $breakpoint-tabletToDesktop) {
  .header {
    display: grid;
    grid-template-columns: 0.4fr 1fr;
    grid-template-rows: 1fr;
    &__summary {
      padding-top: 0;
    }
  }  

  .highlight-data {
    font-size: 1.5rem;
    margin: 1rem;
    margin-right: 3rem;
  }

  .header-mobile {
    display: none;
  }

  .hero {
    display: contents !important;
  }
}
@media only screen and (min-width: $breakpoint-desktopToHighResolution) {
  .header {
    display: grid;
    grid-template-columns: 0.4fr 1fr;
    grid-template-rows: 1fr;
    &__summary {
      padding-top: 0;
    }
  }  

  .highlight-data {
    font-size: 2.5rem;
    margin: 1rem;
    margin-right: 3rem;
  }

  .header-mobile {
    display: none;
  }

  .hero {
    display: contents !important;
  }
}

</style>
