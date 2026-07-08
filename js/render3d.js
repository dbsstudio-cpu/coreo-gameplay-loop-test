// js/render3d.js
const Render3D = {
  CELL_SIZE: 58,

  buildWorld: function(mazeData) {
    const world = document.getElementById('world');
    world.innerHTML = ''; // 清空

    const h = mazeData.length;
    const w = mazeData[0].length;
    const width = w * this.CELL_SIZE;
    const height = h * this.CELL_SIZE;
    world.style.width = `${width}px`;
    world.style.height = `${height}px`;
    world.style.marginLeft = `-${width / 2}px`;
    world.style.marginTop = `-${height / 2}px`;

    let startPos = { x: 0, y: 0 };
    const isPath = (cx, cy) => (cy >= 0 && cy < h && cx >= 0 && cx < w && mazeData[cy][cx] > 0);

    // ==========================================
    // 1. 路徑處理 (找出轉角，並將直線合併成槽)
    // ==========================================
    let visitedPaths = Array(h).fill(0).map(() => Array(w).fill(false));

    // 先獨立標記並建立所有「轉角/岔路」
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (mazeData[y][x] > 0) {
          const N = isPath(x, y - 1);
          const S = isPath(x, y + 1);
          const W = isPath(x - 1, y);
          const E = isPath(x + 1, y);
          const numNeighbors = N + S + W + E;

          let isCorner = false;
          if (numNeighbors > 2) isCorner = true; // 岔路口
          else if (numNeighbors === 2 && ((N && W) || (N && E) || (S && W) || (S && E))) isCorner = true; // L型轉角

          if (isCorner) {
            this.createBlock(world, x, y, 1, 1, 'path corner', y / h);
            visitedPaths[y][x] = true;
          }
        }
      }
    }

    // 將剩下的直線路徑進行貪婪合併 (Greedy Mesh)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (mazeData[y][x] > 0 && !visitedPaths[y][x]) {
          let cx = x;
          while (cx < w && mazeData[y][cx] > 0 && !visitedPaths[y][cx]) cx++;
          let blockW = cx - x;

          let blockH = 1;
          let canExpandDown = true;
          while (y + blockH < h && canExpandDown) {
            for (let tx = x; tx < x + blockW; tx++) {
              if (mazeData[y + blockH][tx] <= 0 || visitedPaths[y + blockH][tx]) {
                canExpandDown = false; break;
              }
            }
            if (canExpandDown) blockH++;
          }

          for (let ty = y; ty < y + blockH; ty++) {
            for (let tx = x; tx < x + blockW; tx++) {
              visitedPaths[ty][tx] = true;
            }
          }
          this.createBlock(world, x, y, blockW, blockH, 'path', y / h);
        }
      }
    }

    // ==========================================
    // 2. 牆體處理 (全面貪婪合併成大型實體區塊)
    // ==========================================
    let visitedWalls = Array(h).fill(0).map(() => Array(w).fill(false));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (mazeData[y][x] === 0 && !visitedWalls[y][x]) {
          let cx = x;
          while (cx < w && mazeData[y][cx] === 0 && !visitedWalls[y][cx]) cx++;
          let blockW = cx - x;

          let blockH = 1;
          let canExpandDown = true;
          while (y + blockH < h && canExpandDown) {
            for (let tx = x; tx < x + blockW; tx++) {
              if (mazeData[y + blockH][tx] !== 0 || visitedWalls[y + blockH][tx]) {
                canExpandDown = false; break;
              }
            }
            if (canExpandDown) blockH++;
          }

          for (let ty = y; ty < y + blockH; ty++) {
            for (let tx = x; tx < x + blockW; tx++) {
              visitedWalls[ty][tx] = true;
            }
          }
          // 牆體深度以底部為準
          const depthY = (y + blockH - 1) / h;
          this.createBlock(world, x, y, blockW, blockH, 'wall', depthY);
        }
      }
    }

    // ==========================================
    // 3. 獨立功能實體疊加 (起點/出口/核心)
    // ==========================================
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const type = mazeData[y][x];
        if (type === 2) {
          startPos = { x: x * this.CELL_SIZE + this.CELL_SIZE / 2, y: y * this.CELL_SIZE + this.CELL_SIZE / 2 };
          this.createEntity(world, x, y, 'start');
        } else if (type === 3) {
          this.createEntity(world, x, y, 'exit');
        } else if (type === 4) {
          const core = document.createElement('div');
          core.className = 'light-core-item';
          core.id = `core-${x}-${y}`;
          // 直接定位於中心
          core.style.left = `${x * this.CELL_SIZE + this.CELL_SIZE / 2}px`;
          core.style.top = `${y * this.CELL_SIZE + this.CELL_SIZE / 2}px`;
          world.appendChild(core);
        }
      }
    }

    return startPos;
  },

  // 創建背景/結構區塊
  createBlock: function(world, x, y, w, h, classes, yRatio) {
    const block = document.createElement('div');
    block.className = `cell ${classes}`;
    block.style.left = `${x * this.CELL_SIZE}px`;
    block.style.top = `${y * this.CELL_SIZE}px`;
    block.style.width = `${w * this.CELL_SIZE}px`;
    block.style.height = `${h * this.CELL_SIZE}px`;
    // 傳入深度參數供 CSS 取用
    block.style.setProperty('--y-ratio', yRatio.toFixed(3));
    world.appendChild(block);
  },

  // 創建無實體碰撞的視覺標記 (如起點環、出口環)
  createEntity: function(world, x, y, typeClass) {
    const entity = document.createElement('div');
    entity.className = `cell entity ${typeClass}`;
    entity.style.left = `${x * this.CELL_SIZE}px`;
    entity.style.top = `${y * this.CELL_SIZE}px`;
    entity.style.width = `${this.CELL_SIZE}px`;
    entity.style.height = `${this.CELL_SIZE}px`;
    world.appendChild(entity);
  }
};