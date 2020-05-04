<template>
  <div class="header">
    <div class="header__title">
      <section class="header-mobile">
        <h3 class="subtitle is-3">
          COVID-19
          <label class="small"> - actualizado {{ formattedDate }}-</label>
        </h3>
      </section>
      <section class="hero is-light">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              COVID-19
              <label class="version text-light"> v{{ version }}</label>
            </h1>
            <h2 class="subtitle">
              Situación actual en España ({{ formattedDate }})
            </h2>
          </div>
        </div>
      </section>
    </div>
    <stats-dashboard
      v-if="dataLoaded"
      :todayData="nationalTodayData"
      :yesterdayData="nationalYesterdayData"
    >
    </stats-dashboard>
  </div>
</template>
<script>
import StatsDashboard from "@/components/StatsDashboard";
import { mapState } from "vuex";

export default {
  components: {
    StatsDashboard
  },
  data() {
    return {
      version: process.env.VERSION
    };
  },
  computed: {
    ...mapState({
      activeLayer: state => state.activeLayer,
      nationalTodayData: state => state.nationalData.today,
      nationalYesterdayData: state => state.nationalData.yesterday
    }),
    dataLoaded() {
      return (
        Object.keys(this.nationalTodayData).length > 0 &&
        Object.keys(this.nationalYesterdayData).length > 0
      );
    },
    formattedDate() {
      return this.nationalTodayData.fecha && this.nationalTodayData.fecha !== ""
        ? new Date(this.nationalTodayData.fecha)
            .toLocaleString("es-ES", {})
            .slice(0, 10)
        : "";
    }
  }
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

@media only screen and (min-width: $breakpoint-tabletToDesktop) {
  .header {
    display: grid;
    grid-template-columns: 0.4fr 1fr;
    grid-template-rows: 1fr;
  }

  .header-mobile {
    display: none;
  }

  .hero {
    display: contents !important;
  }
}
@media only screen and (min-width: $breakpoint-desktopToHighResolution) {
  .header-mobile {
    display: none;
  }

  .hero {
    display: contents !important;
  }
}
</style>
