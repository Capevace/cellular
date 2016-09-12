// Made by Lukas von Mateffy (@Capevace)

document
  .querySelector('#render')
  .addEventListener('click', () => {
    drawRule(
      document.querySelector('#rule').value,
      document.querySelector('#random').checked,
      document.querySelector('#delayed').checked,
      document.querySelector('#delay').value
    );
  });

let interval;

function drawRule(rule, randomStart, delayed, delay) {
  rule = rule ? rule.toString() + '' : '114';

  clearInterval(interval);

  const canvas = document.querySelector('#row-canvas');
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  const lineLength = 100;
  const maxLineCount = 50;
  const nodeSize = {
    width: canvas.width / lineLength,
    height: canvas.height / maxLineCount
  };

  let currentLine = [];
  let currentLineIndex = 0;

  function drawLine(y, nodes) {
    for (let i = 0; i < nodes.length; i++) {
      context.fillStyle = nodes[i] === 0 ? '#8e44ad' : '#f39c12';
      context.fillRect(i * nodeSize.width, y * nodeSize.height, nodeSize.width, nodeSize.height);
    }
  }

  if (delayed) {
    interval = setInterval(renderLoop, delay);
  } else {
    renderLoop();
  }

  function renderLoop() {
    if (currentLineIndex < maxLineCount) {
      if (currentLineIndex === 0) {
        currentLine = randomStart ? generateRandomLine() : generateLineWithCenter();
      } else {
        currentLine = generateLineFromLine(currentLine);
      }
      // console.log(currentLine);
      drawLine(currentLineIndex, currentLine);
      currentLineIndex++;

      if (!delayed)
        renderLoop();
    }
  }

  function generateLineWithCenter() {
    let line = new Array(lineLength)
      .fill(0);

    line[Math.round(lineLength/2)] = 1;

    return line;
  }

  function generateRandomLine() {
    return new Array(lineLength)
      .fill(undefined)
      .map(() => Math.round(Math.random()))
  }


  function generateLineFromLine(oldLine) {
    return oldLine.map((currentNode, index, line) => {
      let newValue;

      const currentActive = isNodeActive(currentNode);
      const leftActive = isNodeActive(line[index - 1]);
      const rightActive = isNodeActive(line[index + 1]);

      return applyRule(currentActive, leftActive, rightActive, rule);
    });
  }

  function isNodeActive(node) {
    let active;
    if (node) {
      active = node === 1 ? 1 : 0;
    } else {
      active = 0;
    }

    return active;
  }

  function applyRule(current, left, right, ruleNumber) {
    const rule = rules[ruleNumber + ''];

    // 111
    if (left === 1 && current === 1 && right === 1) {
      return rule['111'];
    }

    // 110
    else if (left === 1 && current === 1 && right === 0) {
      return rule['110'];
    }

    // 101
    else if (left === 1 && current === 0 && right === 1) {
      return rule['101'];
    }

    // 100
    else if (left === 1 && current === 0 && right === 0) {
      return rule['100'];
    }

    // 011
    else if (left === 0 && current === 1 && right === 1) {
      return rule['011'];
    }

    // 010
    else if (left === 0 && current === 1 && right === 0) {
      return rule['010'];
    }

    // 001
    else if (left === 0 && current === 0 && right === 1) {
      return rule['001'];
    }

    // 000
    else if (left === 0 && current === 0 && right === 0) {
      return rule['000'];
    }

    else {
      console.error('Something terrible happened! Heres the data:', left, current, right, rule);
    }
  }
}

drawRule(114, false, false, 0);
