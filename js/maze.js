// js/maze.js
const MazeLogic = {
  // 0: 牆壁, 1: 可行走區, 2: 入口(起點), 3: 出口
  // 不規則佈局，含死路，避免一眼看穿路線
  getLevelData: function() {
    return [
      [2, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 1, 1],
      [1, 1, 1, 0, 1, 0, 0],
      [1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 0, 1],
      [0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 3],
    ];
  },

  findCell: function(mazeData, cellType) {
    for (let y = 0; y < mazeData.length; y++) {
      for (let x = 0; x < mazeData[y].length; x++) {
        if (mazeData[y][x] === cellType) return { x, y };
      }
    }
    return null;
  },

  // BFS 驗證入口(2)到出口(3)是否連通，避免無解迷宮
  isSolvable: function(mazeData) {
    const start = this.findCell(mazeData, 2);
    const end = this.findCell(mazeData, 3);
    if (!start || !end) return false;

    const size = mazeData.length;
    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    const queue = [[start.x, start.y]];
    visited[start.y][start.x] = true;
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      if (x === end.x && y === end.y) return true;

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
        if (mazeData[ny][nx] === 0) continue; // 牆，不可通行
        if (visited[ny][nx]) continue;
        visited[ny][nx] = true;
        queue.push([nx, ny]);
      }
    }
    return false;
  }
};
