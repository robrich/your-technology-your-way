<template>
  <div class="about">
    <h1>A modern app in TypeScript</h1>
    <ul class="nodots">
      <li>TypeScript SPA with Vue.js</li>
      <li>Node &amp; Express API</li>
      <li>PM2 service</li>
      <li>gRPC</li>
    </ul>
    <p>Inspired by the ASP.NET Insiders 2019 tour</p>
    <div>
      <h2>Server details</h2>
      <p>Language: {{language}}</p>
      <p>Runtime: {{runtime}}</p>
      <p>Version: {{version}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VersionData } from '../types/VersionData';
import axios from 'axios';

export default defineComponent({

  data() {
    const data: VersionData = {
      language: '',
      runtime: '',
      version: '',
    };
    return data;
  },

  mounted: function () {
    this.loadData();
  },

  methods: {

    async loadData() {
      const res = await axios.get<VersionData>('/api/version');
      if (res?.data) {
        this.language = res.data.language;
        this.runtime = res.data.runtime;
        this.version = res.data.version;
      }
    }
  }

});
</script>

<style scoped>
.nodots {
  list-style: none;
  padding-left: 0;
}
</style>
