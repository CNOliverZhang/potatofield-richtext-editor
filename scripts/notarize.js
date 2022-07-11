const { notarize } = require('electron-notarize');

exports.default = (context) => {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return Promise.resolve();
  }
  const { appleId, appleIdPassword } = require('./notarize-config');
  const appName = context.packager.appInfo.productFilename;
  return notarize({
    appBundleId: 'cn.potatofield.richtexteditor',
    appPath: `${appOutDir}/${appName}.app`,
    appleId,
    appleIdPassword,
  });
};
