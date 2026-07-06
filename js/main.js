// js/main.js
window.addEventListener('DOMContentLoaded', () => {
  console.log('COREO 總架構載入中...');

  // 1. 初始化各模組
  ProgressLogic.init();
  CameraLogic.init();
  AudioLogic.init();
  HapticsLogic.init();

  const mazeData = MazeLogic.getLevelData();
  const container = document.getElementById('maze-container');

  // 2. 迷宮可解性驗證，無解直接中止並回報，不讓玩家卡在無解關卡
  if (!MazeLogic.isSolvable(mazeData)) {
    console.error('COREO: 迷宮無解，請檢查 maze.js 的 getLevelData()');
    return;
  }

  // 3. 更新頂部 UI 進度
  let currentLevel = ProgressLogic.getCurrentLevel();
  function updateLevelDisplay() {
    document.getElementById('level-display').textContent = `LEVEL ${currentLevel.toString().padStart(2, '0')}`;
  }
  updateLevelDisplay();

  // 4. 玩家位置：從迷宮資料動態找入口，不寫死座標
  const start = MazeLogic.findCell(mazeData, 2);
  let playerPos = { x: start.x, y: start.y };

  function renderMaze() {
    container.innerHTML = '';

    for (let y = 0; y < mazeData.length; y++) {
      for (let x = 0; x < mazeData[y].length; x++) {
        const cellType = mazeData[y][x];
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');

        if (cellType === 0) cellDiv.classList.add('wall');
        if (cellType === 2) cellDiv.classList.add('start');
        if (cellType === 3) cellDiv.classList.add('exit');

        if (x === playerPos.x && y === playerPos.y) {
          const playerCore = document.createElement('div');
          playerCore.classList.add('player-core');
          cellDiv.appendChild(playerCore);
        }

        cellDiv.addEventListener('click', () => handleInteraction(x, y));
        container.appendChild(cellDiv);
      }
    }
  }

  // 5. 克制的完成提示，不使用瀏覽器原生 alert（會破壞高級感）
  function showNotice(text) {
    let notice = document.getElementById('notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'notice';
      document.body.appendChild(notice);
    }
    notice.textContent = text;
    notice.classList.add('show');
    setTimeout(() => notice.classList.remove('show'), 1800);
  }

  function handleInteraction(targetX, targetY) {
    const canMove = ControlLogic.tryMove(playerPos.x, playerPos.y, targetX, targetY, mazeData);

    if (canMove) {
      playerPos.x = targetX;
      playerPos.y = targetY;

      AudioLogic.playSound('move');
      HapticsLogic.trigger('light_tick');
      CameraLogic.focusOn(targetX, targetY);

      renderMaze();

      if (mazeData[targetY][targetX] === 3) {
        AudioLogic.playSound('success');
        HapticsLogic.trigger('heavy_success');
        currentLevel += 1;
        ProgressLogic.saveLevel(currentLevel);
        updateLevelDisplay();
        showNotice('LEVEL COMPLETE');
      }
    } else {
      AudioLogic.playSound('error');
    }
  }

  renderMaze();
});
