<template>
  <div class="header">
    <div class="header__title">
      <section class="header-mobile">
        <h3 class="subtitle is-3">
          COVID-19 <label class="small"> - actualizado {{ formattedDate }}-</label>
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
    <stats-dashboard v-if="dataLoaded" :todayData="todayData" :yesterdayData="yesterdayData"> </stats-dashboard>
  </div>
</template>
<script>
import { getNationalData } from "@/api/datadista.js";
import StatsDashboard from "@/components/StatsDashboard";

export default {
  components: {
    StatsDashboard,
  },
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
    }   
  },
};
</script>
<style lang="scss">
.header {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 50px;
  background-color: #f5f5f5;
  padding-left: 1rem;
  &__title {
    text-align: center;
    padding: 0.4rem;
  } 
} 

.sub-data {
  font-size: 0.5rem;
  margin-right: 0.4rem;
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

.small {
  font-size: 0.9rem;
}

.b-tooltip {
  z-index: 5001;
}

/* Non-mobile styles, 750px breakpoint (tablets) */
@media only screen and (min-width: $breakpoint-movilToTablet) {
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
  } 

  .sub-data {
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
  .sub-data {
    font-size: 2rem;
  }

  .header-mobile {
    display: none;
  }

  .hero {
    display: contents !important;
  }
}
</style>
