<template>
  <div>
    {{ state.name }}
    <t-button shape="circle" theme="primary">确定</t-button>
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from "electron";
const state = reactive({
  name: "dddd",
});
ipcRenderer.send("main-process-message", "99999999");
window["ipcRenderer"] = ipcRenderer;
</script>
