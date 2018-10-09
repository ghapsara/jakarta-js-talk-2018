<template>
  <div id="app" :style="[appHeight]">
    <div class="container">
      <div class="sidebar" :style="[appHeight]">
        <div class="title">Package Explorer</div>
        <search @selectPackage="selectPackage"/>
      </div>
      <div class="viz">
        <bundle-viz :packageName="selectedPackage"/>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './components/Search.vue';
import BundleViz from './components/BundleViz.vue';

export default {
  name: 'app',
  data() {
    return {
      selectedPackage: null
    };
  },
  components: {
    Search,
    BundleViz
  },
  computed: {
    appHeight() {
      return {
        height: `${window.innerHeight}px`
      };
    }
  },
  methods: {
    selectPackage(name) {
      this.selectedPackage = name;
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.container {
  display: flex;
}
.sidebar {
  width: 300px;
  flex-basis: 300px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.viz {
  background: #fce000;
}
.title {
  font-size: 30px;
  font-weight: bold;
  margin-top: 50px;
  margin-bottom: 20px;
  padding: 10px 20px;
}
</style>
