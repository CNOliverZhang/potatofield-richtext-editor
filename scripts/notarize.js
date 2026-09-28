const { notarize } = require('electron-notarize');

exports.default = (context) => {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return Promise.resolve();
  }
  // 凭据由 scripts/notarize-config.js 提供，该文件不入库（已在 .gitignore 中）
  // 支持两种鉴权方式，任选其一：
  //   1. Apple ID：  { appleId, appleIdPassword, teamId }
  //   2. ASC API Key：{ appleApiKey, appleApiKeyId, appleApiIssuer }
  const credentials = require('./notarize-config');
  const appName = context.packager.appInfo.productFilename;
  return notarize({
    appBundleId: 'cn.potatofield.richtexteditor',
    appPath: `${appOutDir}/${appName}.app`,
    // Apple 已于 2023 年底停用旧的 altool 公证方式，
    // electron-notarize 默认会回退到 legacy 链路，必须显式指定 notarytool
    tool: 'notarytool',
    ...credentials,
  });
};
