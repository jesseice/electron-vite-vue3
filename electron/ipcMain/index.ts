import { ipcMain } from "electron";
const test = (_, a: string) => {
  console.log("[a] ---> ", a);
};
ipcMain.on("test", test);
