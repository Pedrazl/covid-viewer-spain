<script>
import {
  getNationalData,
  getCasesByRegion,
  getDeathsByRegion,
  getRecoveredByRegion
} from "@/api/datadista.js";
import { mapActions } from "vuex";

export default {
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    ...mapActions({
      setNationalData: "setNationalData",
      setRegionalData: "setRegionalData"
    }),
    async init() {
      try {
        await this.loadCovidData();
        this.$emit("data-load-ready");
      } catch (e) {
        this.$emit("data-load-error", `Error loading data. Detail: ${e}`);
      }
    },
    async loadCovidData() {
      try {
        this.$emit("statusLoading", true);
        /* National Data */
        var nationalData = await getNationalData();
        var nationalLastDays = this.getLastTwoDaysData(nationalData.data);
        this.setNationalData({
          today: nationalLastDays[0],
          yesterday: nationalLastDays[1]
        });

        /* Regional Data */
        var casesData = await getCasesByRegion();
        var deathsData = await getDeathsByRegion();
        var recoveredData = await getRecoveredByRegion();

        this.setRegionalData({
          cases: casesData,
          deaths: deathsData,
          recovered: recoveredData
        });
        /* */
        this.$emit("statusLoading", false);
      } catch (err) {
        console.error(err);
      }
    },
    getLastTwoDaysData(serieData) {
      for (let i = serieData.length - 1; i > 0; i--) {
        if (serieData[i].fecha !== "") {
          return [serieData[i], serieData[i - 1]];
        }
      }
      return null;
    }
  },
  render: () => null
};
</script>
