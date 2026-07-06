// js/progress.js
const ProgressLogic = {
  STORAGE_KEY: 'coreo_save_data',

  init: function() {
    let data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      this.saveLevel(1); // 預設第 1 關
    }
  },

  getCurrentLevel: function() {
    return parseInt(localStorage.getItem(this.STORAGE_KEY)) || 1;
  },

  saveLevel: function(level) {
    localStorage.setItem(this.STORAGE_KEY, level);
    console.log(`[Progress] 已儲存進度：Level ${level}`);
  }
};
