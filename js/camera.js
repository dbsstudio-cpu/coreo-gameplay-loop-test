// js/camera.js
const CameraLogic = {
  worldDOM: null,
  currentY: 0,
  targetY: 0,

  init: function() {
    this.worldDOM = document.getElementById('world');
  },

  // 以玩家的 Y 軸為基準，推動整個世界
  update: function(playerScreenY) {
    if (!this.worldDOM) return;

    // 讓玩家保持在畫面的偏下方 (營造往前看的視野)
    // 當玩家往上走(Y減少)，世界要往下推(Y增加)
    this.targetY = -playerScreenY;

    // 簡單的線性插值(Lerp)平滑鏡頭
    this.currentY += (this.targetY - this.currentY) * 0.1;

    // 保持 rotateX 透視，並移動 translateY
    this.worldDOM.style.transform = `rotateX(55deg) translateZ(-50px) translateY(${this.currentY}px)`;
  }
};
