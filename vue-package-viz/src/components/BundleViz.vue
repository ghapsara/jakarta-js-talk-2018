<template>
  <div class="viz-container">
    <svg ref="vizRef" :width="svgWidth" :height="svgHeight" />
    <div class="summary" v-if="bundleData">
      <div class="package-name">{{bundleData.name}}</div>
      <div class="package-size">{{formatNumber(bundleData.size)}}<span class="label"> kB</span></div>
      <div class="package-dep">{{bundleData.dependencyCount}} <span class="label">depedencies</span></div>
    </div>
  </div>
</template>

<script>
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, switchMap, catchError, takeUntil } from 'rxjs/operators';
import Chart, { WIDTH, HEIGHT, numberFormatter } from './Chart';
import { throwError } from 'rxjs/internal/observable/throwError';

export default {
  name: 'BundleViz',
  computed: {
    svgWidth() {
      return WIDTH;
    },
    svgHeight() {
      return HEIGHT;
    },
    packageUrl() {
      return `https://bundlephobia.com/api/size?package=${
        this.packageName
      }&record=true`;
    }
  },
  methods: {
    formatNumber(num) {
      const kb = num / 1024;
      return numberFormatter(kb);
    }
  },
  props: {
    packageName: {
      type: String,
      default: null
    }
  },
  subscriptions() {
    const bundleData$ = this.$watchAsObservable('packageName').pipe(
      switchMap(() => {
        return ajax.get(this.packageUrl).pipe(
          map(d => d.response),
          catchError(err => {
            return of([]);
          })
        );
      })
    );

    return {
      bundleData: bundleData$
    };
  },
  created() {
    this.$watch('bundleData', val => {
      if (val.dependencySizes.length > 0) {
        Chart(this.$refs.vizRef, val.dependencySizes);
      }
    });
  }
};
</script>

<style scoped>
.viz-container {
  position: relative;
}
.summary {
  position: absolute;
  top: 40px;
  left: 20px;
  color: black;
  opacity: 0.5;
}
.package-name {
  font-size: 70px;
}
.package-size {
  font-size: 26px;
}
.package-dep {
  font-size: 24px;
}
.label {
  color: #2c3e50;
  font-size: 12px;
}
</style>