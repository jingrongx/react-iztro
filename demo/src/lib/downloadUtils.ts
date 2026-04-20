const version = __APP_VERSION__;

const GITHUB_REPO = 'jingrongx/react-iztro';

export const getApkDownloadUrl = () =>
  `https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_v${version}.apk`;

export const getGhproxyApkDownloadUrl = () =>
  `https://ghproxy.net/https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_v${version}.apk`;

export const getExeDownloadUrl = () =>
  `https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_${version}_x64-setup.exe`;

export const getGhproxyExeDownloadUrl = () =>
  `https://ghproxy.net/https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_${version}_x64-setup.exe`;
