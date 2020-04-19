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
              <label class="version text-light"> v{{ version }}</label>
            </h1>
            <h2 class="subtitle">Situación actual en España ({{ formattedDate }})</h2>
          </div>
        </div>
      </section>
    </div>
    <div class="header__summary" v-if="dataLoaded">
      <div>
        <div class="container-primary">
          <span class="mdi mdi-account-group container-primary__ico"></span>
          <b-tooltip label="Casos confirmados acumulados" type="is-dark" position="is-top">
            <label class="container-primary__label"> {{ formatNumbers(todayData.casos) }} </label></b-tooltip
          >
          <label class="sub-data">(+{{ casesDifference }})</label>
        </div>
        <div class="container-secondary">
          <i class="material-icons container-secondary__icon">{{ casesTrend > 0 ? "trending_up" : "trending_down" }}</i>
          <label class="container-secondary__label">{{ casesTrend }}%</label>
        </div>
      </div>
      <div>
        <div class="container-primary">
          <span class="mdi mdi-heart container-primary__ico"></span>
          <b-tooltip label="Personas curadas acumuladas" type="is-dark" position="is-top">
            <label class="container-primary__label"> {{ formatNumbers(todayData.altas) }} </label></b-tooltip
          >
          <label class="sub-data"> (+{{ recoveredDifference }})</label>
        </div>
        <div class="container-secondary">
          <i class="material-icons container-secondary__icon">{{
            recoveredTrend > 0 ? "trending_up" : "trending_down"
          }}</i>
          <label class="container-secondary__label">{{ recoveredTrend }}%</label>
        </div>
      </div>
      <div>
        <div class="container-primary">
          <span class="mdi mdi-grave-stone container-primary__ico"></span>
          <b-tooltip label="Personas fallecidas acumuladas" type="is-dark" position="is-top">
            <label class="container-primary__label"> {{ formatNumbers(todayData.fallecimientos) }}</label></b-tooltip
          >
          <label class="sub-data">(+{{ deathsDifference }})</label>
        </div>
        <div class="container-secondary">
          <i class="material-icons container-secondary__icon">{{
            deathsTrend > 0 ? "trending_up" : "trending_down"
          }}</i>
          <label class="container-secondary__label">{{ deathsTrend }}%</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getNationalData } from "@/api/datadista.js";
import { calculateTrend } from "@/util.js";

export default {
  data() {
    return {
      todayData: {},
      yesterdayData: {},
      version: process.env.VERSION,
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
    casesTrend() {
      return calculateTrend(this.todayData.casos, this.yesterdayData.casos);
    },
    recoveredDifference() {
      return this.todayData.altas - this.yesterdayData.altas;
    },
    recoveredTrend() {
      return calculateTrend(this.todayData.altas, this.yesterdayData.altas);
    },
    deathsDifference() {
      return this.todayData.fallecimientos - this.yesterdayData.fallecimientos;
    },
    deathsTrend() {
      return calculateTrend(this.todayData.fallecimientos, this.yesterdayData.fallecimientos);
    },
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
        this.$emit("statusLoading", true);
        var parsedData = await getNationalData();
        var lastDaysData = this.getLastTwoDaysData(parsedData.data);
        this.setData(lastDaysData[0], lastDaysData[1]);
        this.$emit("statusLoading", false);
      } catch (err) {
        console.log(err);
      }
    },
    getLastTwoDaysData(serieData) {
      for (let i = serieData.length - 1; i > 0; i--) {
        if (serieData[i].fecha !== "") {
          return [serieData[i], serieData[i - 1]];
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
    },
  },
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
  &__trends {
    display: flex;
    padding-top: 1rem;
    align-items: center;
    color: black;
    justify-content: center;
  }
}

.version {
  font-size: 0.6rem;
}

.text-light {
  font-weight: 300;
}

.hero {
  display: none !important;
}

.container-primary {
  &__ico {
    font-size: 40px;
  }
  &__label {
    font-size: 1rem;
    margin: 0.5rem;
  }
}

.container-secondary {
  text-align: center;
  &__icon {
    vertical-align: bottom;
    margin-right: 0.5rem;
  }
  &__label {
    font-size: 1rem;
  }
}

.sub-data {
  font-size: 0.8rem;
  margin-right: 1rem;
}

/* Non-mobile styles, 750px breakpoint */
@media only screen and (min-width: $breakpoint-movilToTablet) {
  .container-primary {
    &__ico {
      font-size: 40px;
    }
    &__label {
      font-size: 1.5rem;
      margin: 0.5rem;
    }
  }
  .container-secondary {
    text-align: center;
    &__icon {
      vertical-align: bottom;
      margin-right: 0.5rem;
    }
    &__label {
      font-size: 1.5rem;
    }
  }
  .sub-data {
    font-size: 1rem;
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
  .container-primary {
    &__ico {
      font-size: 40px;
    }
    &__label {
      font-size: 1.5rem;
      margin: 0.9rem;
    }
  }
  .container-secondary {
    text-align: center;
    &__icon {      
      margin-bottom: 5px;
      margin-right: 0.5rem;
    }
    &__label {
      font-size: 1.4rem;
    }
  }

  .sub-data {
    font-size: 1rem;
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

  .container-primary {
    &__ico {
      font-size: 40px;
    }
    &__label {
      font-size: 2.5rem;
      margin: 0.9rem;
    }
  }

  .container-secondary {
    text-align: center;
    &__icon {
      font-size: 1.8rem;  
      margin-bottom: 10px;
      margin-right: 0.8rem;
    }
    &__label {
      font-size: 2rem;
    }
  }

  .sub-data {
    font-size: 2rem;
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
