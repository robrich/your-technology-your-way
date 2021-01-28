<template>
  <div class="about">
    <h1>A Vue.js / Express / Node / gRPC App</h1>
    <p>Inspired by the ASP.NET Insiders 2019 tour</p>
    <div>
      <h2>Server details</h2>
      <p>Language: {{language}}</p>
      <p>Runtime: {{runtime}}</p>
      <p>Version: {{version}}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {

  data() {
    return {
      language: '',
      runtime: '',
      version: '',
    };
  },

  mounted: function () {
    this.loadData();
  },

  methods: {

    async loadData() {
      const res = await axios.get('/api/version');
      if (res && res.data) {
        this.language = res.data.language;
        this.runtime = res.data.runtime;
        this.version = res.data.version;
      }
    }
  }

}
</script>

<style scoped>

</style>
