import 'phaser';
import PhaserNavMeshPlugin from "phaser-navmesh/dist/phaser-navmesh";
import phaserReact from "phaser3-react";
console.log('navmesh plugin', PhaserNavMeshPlugin);
export default {
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
  zoom: 1,
  // pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false,
    }
  },
  plugins: {
    global: [
      {
        key: 'phaser-react',
        plugin: phaserReact,
        start: true,
      
      }
    ],
    scene: [
      {
        key: "PhaserNavMeshPlugin", // Key to store the plugin class under in cache
        plugin: PhaserNavMeshPlugin, // Class that constructs plugins
        mapping: "navMeshPlugin", // Property mapping to use for the scene, e.g. this.navMeshPlugin
        start: true
      }
    ]
  },
};