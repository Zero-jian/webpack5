<template>
  <router-view></router-view>
</template>

<script>
import Home from './home.vue'
export default {
  components: {
    Home
  },
  data() {
    return {
      message: "Hello Vue",
    };
  },
};
</script>
<style></style>
