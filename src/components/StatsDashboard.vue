<template>
  <div class="header__summary">
    <b-tooltip
      label="Nº de Casos Confirmados"
      type="is-dark"
      position="is-bottom"
      size="is-small"
      multilined
    >
      <div
        class="layer-switcher"
        :class="activeLayer === 'cases' ? 'selected__cases' : ''"
        @click="setActiveLayer('cases')"
      >
        <div class="container-primary">
          <span class="mdi mdi-account-group container-primary__ico"></span>

          <label class="container-primary__label">
            {{ formatNumbers(todayData.casos_total) }}
          </label>
        </div>
        <div class="container-secondary">
          <i class="material-icons container-secondary__icon">{{
            casesTrend > 0 ? "trending_up" : "trending_down"
          }}</i>
          <label class="container-secondary__label">{{ casesTrend }}%</label>
          <label class="container-secondary__small-label"
            >(+{{ casesDifference }})</label
          >
        </div>
      </div>
    </b-tooltip>
    <b-tooltip
      label="Nº de Personas Curadas"
      type="is-dark"
      position="is-bottom"
      size="is-small"
      multilined
    >
      <div
        class="layer-switcher"
        :class="activeLayer === 'recovered' ? 'selected__recovered' : ''"
        @click="setActiveLayer('recovered')"
      >
        <div class="container-primary">
          <span class="mdi mdi-heart container-primary__ico"></span>

          <label class="container-primary__label">
            {{ formatNumbers(todayData.altas) }}
          </label>
        </div>
        <div class="container-secondary">
          <i class="material-icons container-secondary__icon">{{
            recoveredTrend > 0 ? "trending_up" : "trending_down"
          }}</i>
          <label class="container-secondary__label"
            >{{ recoveredTrend }}%</label
          >
          <label class="container-secondary__small-label">
            (+{{ recoveredDifference }})</label
          >
        </div>
      </div>
    </b-tooltip>
    <b-tooltip
      label="Nº de Personas Fallecidas"
      type="is-dark"
      position="is-bottom"
      size="is-small"
      multilined
    >
      <div
        class="layer-switcher"
        :class="activeLayer === 'deaths' ? 'selected__deaths' : ''"
        @click="setActiveLayer('deaths')"
      >
        <div class="container-primary">
          <span class="mdi mdi-grave-stone container-primary__ico"></span>

          <label class="container-primary__label">
            {{ formatNumbers(todayData.fallecimientos) }}</label
          >
        </div>
        <div class="container-secondary">
          <i class="material-icons container-secondary__icon">{{
            deathsTrend > 0 ? "trending_up" : "trending_down"
          }}</i>
          <label class="container-secondary__label">{{ deathsTrend }}%</label>
          <label class="container-secondary__small-label"
            >(+{{ deathsDifference }})</label
          >
        </div>
      </div>
    </b-tooltip>
  </div>
</template>
<script>
import { calculateTrend } from "@/util.js";
import { mapState, mapActions } from "vuex";

export default {
  props: {
    todayData: {
      type: Object,
      required: true
    },
    yesterdayData: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      activeLayer: state => state.activeLayer
    }),
    casesDifference() {
      return this.todayData.casos_total - this.yesterdayData.casos_total;
    },
    casesTrend() {
      return calculateTrend(this.todayData.casos_total, this.yesterdayData.casos_total);
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
      return calculateTrend(
        this.todayData.fallecimientos,
        this.yesterdayData.fallecimientos
      );
    }
  },
  methods: {
    ...mapActions({
      setActiveLayer: "setActiveLayer"
    }),
    formatNumbers(number) {
      return Number(number).toLocaleString("es-ES", {});
    }
  }
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
    justify-content: space-evenly;
  }
}

.layer-switcher:hover {
  cursor: pointer;
}

.selected {
  &__cases {
    color: #518bc3;
    border-bottom: 2px solid #518bc3;
  }
  &__recovered {
    color: #41ab5d;
    border-bottom: 2px solid #41ab5d;
  }
  &__deaths {
    color: #cb181d;
    border-bottom: 2px solid #cb181d;
  }
}

.container-primary {
  margin-top: 0.8rem;
  &__ico {
    font-size: 25px;
  }
  &__label {
    font-size: 1rem;
    margin: 0.5rem;
  }
}

.container-secondary {
  &__icon {
    margin-right: 0.2rem;
    vertical-align: middle;
  }
  &__label {
    font-size: 1rem;
  }
  &__small-label {
    margin-left: 0.1rem;
    font-size: 0.6rem;
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
      margin-bottom: 5px;
    }
    &__label {
      font-size: 1.2rem;
    }
    &__small-label {
      margin-left: 0.2rem;
      font-size: 0.8rem;
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
    margin-top: 0;
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
      margin-bottom: 7px;
      margin-right: 0.5rem;
    }
    &__label {
      font-size: 1.4rem;
    }
    &__small-label {
      margin-left: 0.5rem;
      font-size: 1rem;
    }
  }
  .selected {
    &__cases {
      border-bottom: none;
      border-top: 2px solid #518bc3;
    }
    &__recovered {
      border-bottom: none;
      border-top: 2px solid #41ab5d;
    }
    &__deaths {
      border-bottom: none;
      border-top: 2px solid #cb181d;
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
      &__small-label {
        margin-left: 0.5rem;
        font-size: 1.5rem;
      }
    }
  }
}
</style>
