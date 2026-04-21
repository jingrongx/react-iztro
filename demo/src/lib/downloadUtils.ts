const GITHUB_REPO = 'jingrongx/react-iztro';

export const getLatestApkDownloadUrl = () =>
  `https://github.com/${GITHUB_REPO}/releases/latest/download/react-iztro.apk`;

export const getLatestExeDownloadUrl = () =>
  `https://github.com/${GITHUB_REPO}/releases/latest/download/react-iztro_x64-setup.exe`;

export const getGhproxyApkDownloadUrl = (version: string) =>
  `https://ghproxy.net/https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_v${version}.apk`;

export const getGhproxyExeDownloadUrl = (version: string) =>
  `https://ghproxy.net/https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_${version}_x64-setup.exe`;

export const getApkDownloadUrl = (version: string) =>
  `https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_v${version}.apk`;

export const getExeDownloadUrl = (version: string) =>
  `https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_${version}_x64-setup.exe`;

export async function fetchLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.tag_name?.replace(/^v/, '') ?? null;
  } catch {
    return null;
  }
}
