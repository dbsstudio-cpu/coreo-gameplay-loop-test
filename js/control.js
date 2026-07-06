// js/control.js
const ControlLogic = {
  // 檢查是否為十字相鄰格子（只能走一步，不能斜走）
  isAdjacent: function(currX, currY, targetX, targetY) {
    const dx = Math.abs(currX - targetX);
    const dy = Math.abs(currY - targetY);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  },

  // 嘗試移動
  tryMove: function(currX, currY, targetX, targetY, mazeData) {
    if (this.isAdjacent(currX, currY, targetX, targetY)) {
      const targetCell = mazeData[targetY][targetX];
      // 只要不是牆壁(0)就可以走
      if (targetCell !== 0) {
        return true;
      }
    }
    return false;
  }
};
