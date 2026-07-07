// js/render3d.js
const Render3D = {
  CELL_SIZE: 58,

  buildWorld: function(mazeData) {
    const world = document.getElementById('world');
    world.innerHTML = ''; // 清空

    const width = mazeData[0].length * this.CELL_SIZE;
    const height = mazeData.length * this.CELL_SIZE;
    world.style.width = `${width}px`;
    world.style.height = `${height}px`;
    world.style.marginLeft = `-${width / 2}px`;
    world.style.marginTop = `-${height / 2}px`;

    let startPos = { x: 0, y: 0 };

    for (let y = 0; y < mazeData.length; y++) {
      for (let x = 0; x < mazeData[y].length; x++) {
        const type = mazeData[y][x];
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.left = `${x * this.CELL_SIZE}px`;
        cell.style.top = `${y * this.CELL_SIZE}px`;

        if (type === 0) cell.classList.add('wall');
        else cell.classList.add('path');

        if (type === 2) {
          cell.classList.add('start');
          startPos = { x: x * this.CELL_SIZE + this.CELL_SIZE / 2, y: y * this.CELL_SIZE + this.CELL_SIZE / 2 };
        } else if (type === 3) {
          cell.classList.add('exit');
        } else if (type === 4) {
          const core = document.createElement('div');
          core.className = 'light-core-item';
          core.id = `core-${x}-${y}`;
          cell.appendChild(core);
        }
        world.appendChild(cell);
      }
    }
    return startPos;
  }
};