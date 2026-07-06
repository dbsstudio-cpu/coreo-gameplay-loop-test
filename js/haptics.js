// js/haptics.js
const HapticsLogic = {
  isSupported: false,

  init: function() {
    // Support-check 降級判斷
    this.isSupported = 'vibrate' in navigator;
    console.log(`[Haptics] 觸覺回饋支援度: ${this.isSupported ? '支援' : '不支援降級處理'}`);
  },

  trigger: function(type) {
    if (!this.isSupported) return;

    // TODO: 下一階段配合原生外殼或 PWA 實作精密觸覺
    console.log(`[Haptics Stub] 觸發震動: ${type}`);
  }
};
