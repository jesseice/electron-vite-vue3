// asarmor 防止解包
const asarmor = require('asarmor');
const { join } = require('path');

exports.default = async ({ appOutDir, packager }) => {
  try {
    const asarPath = join(packager.getResourcesDir(appOutDir), 'app.asar');
    console.info('[正在进行 asarmor 防解包设置]');
    const archive = await asarmor.open(asarPath);
    archive.patch({
      header: {
        files: {
          'foo.js': { offset: 0, size: -999 },
          'bar.js': { offset: -123, size: 1337 },
        },
      },
    });
    await archive.write(asarPath);
    console.info('[asarmor 设置结束]');
  } catch (error) {
    console.error('[asarmor出错] ---> ', error);
  }
};
