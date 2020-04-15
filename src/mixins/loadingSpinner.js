export const loadingSpinnerMixin = {
  data() {
    return {
      isLoading: true,
      isFullPage: true,
    };
  },
  methods: {
    setLoading(visible) {
      this.isLoading = visible;
    },
  },
};
