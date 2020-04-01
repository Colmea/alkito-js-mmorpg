import 'phaser';
import * as PhaserNavMeshPlugin from "phaser-navmesh/dist/phaser-navmesh";

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  width: 1400,
  height: 800,
  zoom: 1,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false,
    }
  },
  plugins: {
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