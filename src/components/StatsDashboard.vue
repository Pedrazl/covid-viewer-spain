<template>
  <div class="header__summary">
    <div>
      <div class="container-primary">
        <span class="mdi mdi-account-group container-primary__ico"></span>
        <b-tooltip label="Casos confirmados acumulados" type="is-dark" position="is-bottom" size="is-small" multilined>
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
        <b-tooltip label="Personas curadas acumuladas" type="is-dark" position="is-bottom" size="is-small" multilined>
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
        <b-tooltip
          label="Personas fallecidas acumuladas"
          type="is-dark"
          position="is-bottom"
          size="is-small"
          multilined
        >
          <label class="container-primary__label"> {{ formatNumbers(todayData.fallecimientos) }}</label></b-tooltip
        >
        <label class="sub-data">(+{{ deathsDifference }})</label>
      </div>
      <div class="container-secondary">
        <i class="material-icons container-secondary__icon">{{ deathsTrend > 0 ? "trending_up" : "trending_down" }}</i>
        <label class="container-secondary__label">{{ deathsTrend }}%</label>
      </div>
    </div>
  </div>
</template>
<script>
import { calculateTrend } from "@/util.js";
export default {
  props: {
    todayData: {
      type: Object,
      required: true,
    },
    yesterdayData: {
      type: Object,
      required: true,
    },
  },
  computed: {
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
  methods: {
    formatNumbers(number) {
      return Number(number).toLocaleString("es-ES", {});
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  &__summary {
    display: flex;
    padding-top: 1.5rem;
    align-items: center;
    color: black;
    justify-content: space-evenly;
  }
  &__trends {
    display: flex;
    padding-top: 1rem;
    align-items: center;
    color: black;
    justify-content: center;
  }
}

.container-primary {
  &__ico {
    font-size: 25px;
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

/* Non-mobile styles, 750px breakpoint (tablets) */
@media only screen and (min-width: $breakpoint-movilToTablet) {
  .container-primary {
    &__label {
      font-size: 1.5rem;
      margin: 0.5rem;
    }
  }
  .container-secondary {
    &__icon {
      margin-bottom: 0.2rem;
      margin-right: 0.2rem;
    }
    &__label {
      font-size: 1.2rem;
    }
  }
}

@media only screen and (min-width: $breakpoint-tabletToDesktop) {
  .header {    
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
    &__icon {
      margin-bottom: 5px;
      margin-right: 0.5rem;
    }
    &__label {
      font-size: 1.4rem;
    }
  }  
}

@media only screen and (min-width: $breakpoint-desktopToHighResolution) {
  .container-primary {
    &__label {
      font-size: 2.5rem;
      margin: 0.9rem;
    }
  }

  .container-secondary {
    &__icon {
      font-size: 1.8rem;
      margin-bottom: 10px;
      margin-right: 0.8rem;
    }
    &__label {
      font-size: 2rem;
    }
  }
}

</style>
