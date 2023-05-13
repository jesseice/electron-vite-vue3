import { app, dialog } from "electron";
import { autoUpdater } from "electron-updater";
/**
 * 检查并更新
 * @param mainWindow 主窗口
 */
const allUpdate = async (mainWindow) => {
  //TODO 放入更新地址
  autoUpdater.setFeedURL("");
  // 更新开始
  const downloadAndUpdate = () => {
    autoUpdater.downloadUpdate(); // 下载更新

    autoUpdater.on("update-downloaded", () => {
      console.info("[ 下载完成, 开始更新 ]");
      autoUpdater.quitAndInstall();
      app.exit();
    });
  };
  autoUpdater.autoDownload = false; // 禁止自动下载

  // 检查出错  错误处理
  autoUpdater.on("error", (error) => {
    console.debug("[error] ---> ", error);
  });

  autoUpdater.on("checking-for-update", () => {
    console.info("[ 正在检查更新...... ]");
  });

  autoUpdater.on("update-available", () => {
    const options = {
      type: "info",
      title: "应用更新",
      message: "发现新版本, 是否更新?",
      buttons: ["是", "否"],
    };
    dialog.showMessageBox(options).then(({ response }) => {
      if (response === 0) {
        downloadAndUpdate();
        return;
      }
      console.log("[ 用户点击了否 ]");
      app.exit();
    });

    console.info("[ 更新包下载成功! ]");
  });

  autoUpdater.on("update-not-available", () => {
    console.info("[ 现在使用的就是最新版本，不用更新 ]");
  });
  autoUpdater.on("error", () => {
    console.info("[ 检查更新出错 ]");
  });
  autoUpdater.on("update-downloaded", () => {
    console.info("[开始更新] ------> ", "更新中...");
    autoUpdater.quitAndInstall();

    app.exit(0); // 退出应用防止用户启动
  });
  autoUpdater.on("download-progress", (progressObj) => {
    console.log("[progressObj] ---> ", progressObj);
    mainWindow.webContents.send("update-percent", progressObj);
  });

  autoUpdater.checkForUpdates();
};

export default allUpdate;
