<template>
  <el-card shadow="always" v-bind:id="id" :class="className" :style="{height:height,width:width}"></el-card>
</template>
<script>
import echarts from "echarts";
export default {
  mixins: [],
  name: "ECharts",
  components: {},
  data() {
    // const deID = Math.floor(Math.random() * 104650);
    return {
      MyChart: null
    };
  },
  props: {
    className: {
      type: String,
      default: "echarsCSS"
    },
    id: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      default: null
    },
    mFunction: {
      type: Function,
      default: null
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "27.77777vh"
    }
  },
  computed: {},
  methods: {
    initChart() {
      let _this = this;
      // _this.MyChart = _this.$echarts.init(myChart);
      _this.MyChart = echarts.init(document.getElementById(_this.id));
      _this.setChart();
      _this.MyChart.on("click", function(params) {
        if (_this.mFunction) _this.mFunction(params);
      });
      // window.addEventListener("resize", function() {
      //   _this.MyChart.resize;
      // });
      window.addEventListener("resize", _this.__resizeHandler);
    },
    setChart() {
      let _this = this;
      _this.$set(_this.data, "animationEasing", "elasticOut");
      _this.$set(_this.data, "animationEasingUpdate", "elasticOut");
      _this.$set(_this.data, "animationDelay", 200);
      _this.$set(_this.data, "animationDelayUpdate", 200);
      _this.MyChart.setOption(_this.data);
    },
    __resizeHandler() {
      if (this.MyChart) {
        this.MyChart.resize();
      }
    }
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        if (newValue) this.initChart();
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    // this.initChart();
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.__resizeHandler);
    if (!this.MyChart) {
      return;
    }
    // if (this.MyChart) this.MyChart.clear();
    this.MyChart.dispose();
    this.MyChart = null;
  },
  destroyed() {}
};
</script>

<style scoped >
.echarsCSS {
  width: 100%;
  height: 27.77777vh;
}
</style>
