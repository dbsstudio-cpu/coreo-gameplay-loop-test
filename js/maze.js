// js/maze.js
const MazeLogic = {
  // 0:牆壁, 1:路徑, 2:起點, 3:出口, 4:一般能量, 5:強化能量
  // 7x22，退回螢幕安全寬度(406px)，5段全寬橫向大廳＋2個死路支線(強化能量)＋1個主路能量
  getTestCorridor: function() {
    const map = [
      [0,0,0,3,0,0,0], // y=0  Exit
      [0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0],
      [0,1,1,1,1,1,0], // y=4  橫向大廳 F
      [0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0],
      [0,1,1,1,1,1,0], // y=7  橫向大廳 E
      [0,0,0,0,5,1,0], // y=8  死路支線(強化能量)
      [0,0,0,0,0,1,0],
      [0,1,1,1,1,1,0], // y=10 橫向大廳 D
      [0,1,0,0,0,0,0],
      [0,1,0,0,0,0,0],
      [0,1,1,1,1,1,0], // y=13 橫向大廳 C
      [0,1,5,0,0,0,0], // y=14 強化能量
      [0,1,0,0,0,0,0],
      [0,1,1,1,1,1,0], // y=16 橫向大廳 B
      [0,0,0,0,0,1,0],
      [0,0,0,0,0,1,0],
      [0,1,1,4,1,1,0], // y=19 橫向大廳 A (一般能量)
      [0,0,0,1,0,0,0],
      [0,0,0,2,0,0,0]  // y=21 Start
    ];
    this.verifySolvable(map);
    return map;
  },

  verifySolvable: function(maze) {
    let start = null, exit = null;
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 2) start = {x, y};
        if (maze[y][x] === 3) exit = {x, y};
      }
    }
    let queue = [start];
    let visited = new Set([`${start.x},${start.y}`]);
    while (queue.length > 0) {
      let curr = queue.shift();
      if (curr.x === exit.x && curr.y === exit.y) return true;
      const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
      for (let d of dirs) {
        let nx = curr.x + d[0], ny = curr.y + d[1];
        if (ny >= 0 && ny < maze.length && nx >= 0 && nx < maze[0].length) {
          if (maze[ny][nx] !== 0 && !visited.has(`${nx},${ny}`)) {
            visited.add(`${nx},${ny}`);
            queue.push({x: nx, y: ny});
          }
        }
      }
    }
    console.error('[Maze] 驗證失敗：無解的走廊！');
    return false;
  }
};
