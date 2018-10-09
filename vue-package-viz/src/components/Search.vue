<template>
  <div class="search-container">
    <div class="search-wrapper">
      <input
        class="search-input"
        placeholder="type package"
        v-stream:input="input$" 
      />
    </div>
    <div class="search-result">
      <div
        v-for="item in searchResult"
        :key="item.name"
        @click="selectPackage(item)"
        class="search-item" 
        :class="{'selected-item': item.isSelected}" 
      >
        <div class="package-name">{{ item.name }}</div>
        <div class="package-version">@{{ item.version }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  pluck,
  map,
  switchMap,
  filter,
  takeUntil,
  debounceTime
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

export default {
  name: 'Search',
  methods: {
    composeSearchUrl(packageName) {
      const q = encodeURI(packageName);
      return `https://api.npms.io/v2/search/suggestions?q=${q}`;
    },
    mapSearchResult(data) {
      return data.map(d => ({
        name: d.package.name,
        version: d.package.version,
        isSelected: false
      }));
    },
    selectPackage(item) {
      this.searchResult = this.searchResult.map(d => ({
        ...d,
        isSelected: d.name === item.name
      }));

      this.$emit('selectPackage', item.name);
    }
  },
  domStreams: ['input$'],
  subscriptions() {
    const inputStream = this.input$.pipe(
      debounceTime(1000),
      pluck('event', 'target', 'value'),
      filter(keyword => keyword.length > 0),
      map(keyword => this.composeSearchUrl(keyword)),
      switchMap(url =>
        ajax
          .get(url)
          .pipe(
            map(r => this.mapSearchResult(r.response)),
            takeUntil(this.input$)
          )
      )
    );

    return {
      searchResult: inputStream
    };
  }
};
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  padding: 10px 20px;
}
.search-input {
  border: 0px;
  border-bottom: 1px dashed black;
  width: 100%;
  font-size: 24px;
  padding: 10px 0px;
  font-weight: bold;
}
.search-wrapper {
  margin-bottom: 10px;
}
.search-input:focus {
  outline: none;
}
.search-result {
  overflow-y: auto;
}
::-webkit-scrollbar {
  display: none;
}
.search-item {
  cursor: pointer;
  padding: 10px 5px;
  border-bottom: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.selected-item {
  background: black;
  color: #fce000;
  font-weight: bold;
  border-bottom: 1px solid black;
}
.package-name {
  margin-right: 5px;
}
.package-version {
  font-weight: bold;
  font-size: 12px;
}
</style>