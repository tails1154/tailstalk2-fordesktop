"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _makerAppx = await jitiImport("@electron-forge/maker-appx");
var _makerDeb = await jitiImport("@electron-forge/maker-deb");
var _makerFlatpak = await jitiImport("@electron-forge/maker-flatpak");

var _makerSquirrel = await jitiImport("@electron-forge/maker-squirrel");
var _makerZip = await jitiImport("@electron-forge/maker-zip");
var _pluginFuses = await jitiImport("@electron-forge/plugin-fuses");
var _pluginVite = await jitiImport("@electron-forge/plugin-vite");
var _publisherGithub = await jitiImport("@electron-forge/publisher-github");

var _fuses = await jitiImport("@electron/fuses");

// import { globSync } from "node:fs";

const STRINGS = {
  author: "Revolt Platforms LTD",
  name: "Stoat",
  execName: "stoat-desktop",
  description: "Open source user-first chat platform."
};

const ASSET_DIR = "assets/desktop";

/**
 * Build targets for the desktop app
 */
const makers = [
new _makerSquirrel.MakerSquirrel({
  name: STRINGS.name,
  authors: STRINGS.author,
  // todo: hoist this
  iconUrl: `https://stoat.chat/app/assets/icon-DUSNE-Pb.ico`,
  // todo: loadingGif
  setupIcon: `${ASSET_DIR}/icon.ico`,
  description: STRINGS.description,
  exe: `${STRINGS.execName}.exe`,
  setupExe: `${STRINGS.execName}-setup.exe`,
  copyright: "Copyright (C) 2025 Revolt Platforms LTD"
}),
new _makerZip.MakerZIP({})];


// skip these makers in CI/CD
if (!process.env.PLATFORM) {
  makers.push(
    // must be manually built (freezes CI process)
    // not much use in being published anyhow
    new _makerAppx.MakerAppX({
      certPass: "",
      packageExecutable: `app\\${STRINGS.execName}.exe`,
      publisher: "CN=B040CC7E-0016-4AF5-957F-F8977A6CFA3B"
    }),
    // flatpak publishing should occur through flathub repos.
    // this is just for testing purposes
    new _makerFlatpak.MakerFlatpak({
      options: {
        id: "chat.stoat.stoat-desktop",
        description: STRINGS.description,
        productName: STRINGS.name,
        productDescription: STRINGS.description,
        runtimeVersion: "25.08",
        icon: {
          "16x16": `${ASSET_DIR}/hicolor/16x16.png`,
          "32x32": `${ASSET_DIR}/hicolor/32x32.png`,
          "64x64": `${ASSET_DIR}/hicolor/64x64.png`,
          "128x128": `${ASSET_DIR}/hicolor/128x128.png`,
          "256x256": `${ASSET_DIR}/hicolor/256x256.png`,
          "512x512": `${ASSET_DIR}/hicolor/512x512.png`
        },
        categories: ["Network"],
        modules: [
        // use the latest zypak -- Electron sandboxing for Flatpak
        {
          name: "zypak",
          sources: [
          {
            type: "git",
            url: "https://github.com/refi64/zypak",
            tag: "v2025.09"
          }]

        }],

        finishArgs: [
        // default arguments found by running
        // DEBUG=electron-installer-flatpak* pnpm make
        "--socket=fallback-x11",
        "--socket=wayland",
        "--share=ipc",
        "--share=network",
        "--device=dri",
        "--device=all",
        "--socket=pulseaudio",
        "--filesystem=home",
        "--filesystem=xdg-run/pipewire-0",
        "--filesystem=xdg-videos:ro",
        "--filesystem=xdg-pictures:ro",
        "--filesystem=xdg-run/speech-dispatcher",
        "--talk-name=org.freedesktop.ScreenSaver",
        "--talk-name=org.freedesktop.Notifications",
        "--talk-name=org.kde.StatusNotifierWatcher",
        "--talk-name=com.canonical.AppMenu.Registrar",
        "--talk-name=com.canonical.indicator.application",
        "--talk-name=com.canonical.Unity",
        "--env=XCURSOR_PATH=/run/host/user-share/icons:/run/host/share/icons",
        "--env=ELECTRON_TRASH=gio",
        "--env=TMPDIR=xdg-run/app/chat.stoat.stoat-desktop"],

        files: []
      }
    }),
    // testing purposes
    new _makerDeb.MakerDeb({
      options: {
        productName: STRINGS.name,
        productDescription: STRINGS.description,
        categories: ["Network"],
        icon: `${ASSET_DIR}/icon.png`
      }
    })
  );
}

const config = {
  packagerConfig: {
    asar: true,
    name: STRINGS.name,
    executableName: STRINGS.execName,
    icon: `${ASSET_DIR}/icon`
    // extraResource: [
    //   // include all the asset files
    //   ...globSync(ASSET_DIR + "/**/*"),
    // ],
  },
  rebuildConfig: {},
  makers,
  plugins: [
  new _pluginVite.VitePlugin({
    // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
    // If you are familiar with Vite configuration, it will look really familiar.
    build: [
    {
      // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
      entry: "src/main.ts",
      config: "vite.main.config.ts",
      target: "main"
    },
    {
      entry: "src/preload.ts",
      config: "vite.preload.config.ts",
      target: "preload"
    }],

    renderer: []
  }),
  // Fuses are used to enable/disable various Electron functionality
  // at package time, before code signing the application
  new _pluginFuses.FusesPlugin({
    version: _fuses.FuseVersion.V1,
    [_fuses.FuseV1Options.RunAsNode]: false,
    [_fuses.FuseV1Options.EnableCookieEncryption]: true,
    [_fuses.FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [_fuses.FuseV1Options.EnableNodeCliInspectArguments]: false,
    [_fuses.FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [_fuses.FuseV1Options.OnlyLoadAppFromAsar]: true
  })],

  publishers: [
  new _publisherGithub.PublisherGithub({
    repository: {
      owner: "stoatchat",
      name: "for-desktop"
    }
  })]

};var _default = exports.default =

config; /* v9-95fb01f2ad06eb03 */
