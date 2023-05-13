<template>
  <div>{{ state.name }}<IndexA /></div>
</template>
<script setup lang="ts">
import { ipcRenderer } from "electron";
import IndexA from "@/components/index.vue";
const state = reactive({
  name: "dddd",
});
ipcRenderer.send("main-process-message", "99999999");
console.log("[ipcRenderer] ---> ", ipcRenderer);
window["ipcRenderer"] = ipcRenderer;
</script>
