/* ========================================
   tree-layout-registry.js - calibration data
   ========================================

   Shared coordinate and anchor metadata for the habit tree.
   This file does not render anything by itself.
   ======================================== */

(function () {
  'use strict';

  window.TreeLayoutRegistry = {
    world: {
      width: 1200,
      height: 760
    },

    trunk: {
      layers: [
        { href: 'assets/svg/tree/trunk-base.svg', className: 'trunk-base' },
        { href: 'assets/svg/tree/bark-texture.svg', className: 'trunk-overlay' },
        { href: 'assets/svg/tree/trunk-highlight.svg', className: 'trunk-overlay' }
      ],
      x: 500,
      y: 180,
      width: 210,
      height: 460,
      attachPoints: {
        rightHigh: { x: 660, y: 272 },
        leftHigh: { x: 548, y: 305 },
        centerTop: { x: 603, y: 232 },
        rightMid: { x: 652, y: 388 },
        leftMid: { x: 552, y: 420 }
      }
    },

    habitSlots: [
      {
        id: 'slot-right-high',
        side: 'right',
        attach: { x: 660, y: 272 },
        asset: 'primaryRight',
        rotation: -7,
        scale: 1
      },
      {
        id: 'slot-left-high',
        side: 'left',
        attach: { x: 548, y: 305 },
        asset: 'primaryLeft',
        rotation: 7,
        scale: 1
      },
      {
        id: 'slot-center-top',
        side: 'center',
        attach: { x: 603, y: 232 },
        asset: 'primaryCenter',
        rotation: 0,
        scale: 0.88
      },
      {
        id: 'slot-right-mid',
        side: 'right',
        attach: { x: 652, y: 388 },
        asset: 'primaryRight',
        rotation: 5,
        scale: 0.88
      },
      {
        id: 'slot-left-mid',
        side: 'left',
        attach: { x: 552, y: 420 },
        asset: 'primaryLeft',
        rotation: -5,
        scale: 0.88
      }
    ],

    branchAssets: {
      primaryRight: {
        href: 'assets/svg/branch/branch-primary-right.svg',
        width: 260,
        height: 170,
        anchor: { x: 15, y: 145 },
        tip: { x: 215, y: 24 },
        defaultScale: 1,
        defaultRotation: 0
      },
      primaryLeft: {
        href: 'assets/svg/branch/branch-primary-left.svg',
        width: 260,
        height: 170,
        anchor: { x: 245, y: 145 },
        tip: { x: 45, y: 24 },
        defaultScale: 1,
        defaultRotation: 0
      },
      primaryCenter: {
        href: 'assets/svg/branch/branch-primary-center.svg',
        width: 180,
        height: 230,
        anchor: { x: 90, y: 218 },
        tip: { x: 105, y: 18 },
        defaultScale: 1,
        defaultRotation: 0
      }
    },

    monthBranchAssets: {
      monthRight: {
        href: 'assets/svg/branch/branch-month-right.svg',
        width: 210,
        height: 135,
        anchor: { x: 10, y: 118 },
        tip: { x: 186, y: 18 },
        defaultScale: 0.85,
        defaultRotation: 0
      },
      monthLeft: {
        href: 'assets/svg/branch/branch-month-left.svg',
        width: 210,
        height: 135,
        anchor: { x: 200, y: 118 },
        tip: { x: 24, y: 18 },
        defaultScale: 0.85,
        defaultRotation: 0
      }
    },

    weekBranchAssets: {
      weekRight: {
        href: 'assets/svg/branch/branch-week-right.svg',
        width: 150,
        height: 100,
        anchor: { x: 10, y: 88 },
        tip: { x: 134, y: 15 },
        defaultScale: 0.68,
        defaultRotation: 0,
        leafSlots: [
          { x: 56, y: 62, rotate: -24, scale: 0.68 },
          { x: 74, y: 48, rotate: 10, scale: 0.64 },
          { x: 90, y: 38, rotate: -8, scale: 0.66 },
          { x: 106, y: 29, rotate: 16, scale: 0.62 },
          { x: 120, y: 22, rotate: -15, scale: 0.64 },
          { x: 131, y: 18, rotate: 8, scale: 0.6 },
          { x: 140, y: 12, rotate: -5, scale: 0.58 }
        ]
      },
      weekLeft: {
        href: 'assets/svg/branch/branch-week-left.svg',
        width: 150,
        height: 100,
        anchor: { x: 140, y: 88 },
        tip: { x: 16, y: 15 },
        defaultScale: 0.68,
        defaultRotation: 0,
        leafSlots: [
          { x: 94, y: 62, rotate: 24, scale: 0.68 },
          { x: 76, y: 48, rotate: -10, scale: 0.64 },
          { x: 60, y: 38, rotate: 8, scale: 0.66 },
          { x: 44, y: 29, rotate: -16, scale: 0.62 },
          { x: 30, y: 22, rotate: 15, scale: 0.64 },
          { x: 19, y: 18, rotate: -8, scale: 0.6 },
          { x: 10, y: 12, rotate: 5, scale: 0.58 }
        ]
      },
      weekUp: {
        href: 'assets/svg/branch/branch-week-up.svg',
        width: 110,
        height: 130,
        anchor: { x: 55, y: 122 },
        tip: { x: 72, y: 10 },
        defaultScale: 0.64,
        defaultRotation: 0,
        leafSlots: [
          { x: 40, y: 78, rotate: -18, scale: 0.62 },
          { x: 64, y: 70, rotate: 14, scale: 0.6 },
          { x: 50, y: 55, rotate: -8, scale: 0.62 },
          { x: 76, y: 45, rotate: 16, scale: 0.58 },
          { x: 58, y: 34, rotate: -14, scale: 0.6 },
          { x: 82, y: 24, rotate: 8, scale: 0.56 },
          { x: 70, y: 14, rotate: -5, scale: 0.54 }
        ]
      }
    },

    leafAssets: {
      real: {
        href: 'assets/svg/leaf/leaf-normal.svg',
        width: 95,
        height: 95,
        anchor: { x: 20, y: 73 },
        className: 'leaf-real'
      },
      entry: {
        href: 'assets/svg/leaf/leaf-pale.svg',
        width: 95,
        height: 95,
        anchor: { x: 20, y: 73 },
        className: 'leaf-entry'
      },
      downgrade: {
        href: 'assets/svg/leaf/leaf-bud.svg',
        width: 80,
        height: 80,
        anchor: { x: 39, y: 62 },
        className: 'leaf-downgrade'
      },
      missed: {
        href: 'assets/svg/leaf/leaf-withered.svg',
        width: 95,
        height: 95,
        anchor: { x: 20, y: 73 },
        className: 'leaf-missed'
      }
    }
  };
})();
