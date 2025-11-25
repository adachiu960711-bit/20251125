let runSheet, walkSheet, jumpSheet;
let runFrames = [], walkFrames = [], jumpFrames = [];
let currentFrame = 0;
let runFramesLoaded = false, walkFramesLoaded = false, jumpFramesLoaded = false;

// 角色狀態: 'idle' (靜止), 'running', 'walking', 'jumping'
let characterState = 'idle'; 

// 角色位置、速度和方向
let characterX;
let characterY;
let characterSpeed = 3; // 角色移動速度
let characterDirection = 1; // 1 表示向右，-1 表示向左
// 跑步動畫的參數 ('跑.png')
const runSheetWidth = 810;  // 總寬度 (162px * 5)
const runSheetHeight = 177; // 總高度
const runFrameCount = 5;    // 畫格數量
const runFrameWidth = runSheetWidth / runFrameCount;

// 走路動畫的參數 ('走.png')
const walkSheetWidth = 619;
const walkSheetHeight = 188;
const walkFrameCount = 6;
const walkFrameWidth = walkSheetWidth / walkFrameCount;

// 跳躍動畫的參數 ('跳.png')
const jumpSheetWidth = 1941;
const jumpSheetHeight = 212;
const jumpFrameCount = 14;
const jumpFrameWidth = jumpSheetWidth / jumpFrameCount;

function preload() {
  // 同時載入跑步和走路的圖片
  runSheet = loadImage('2/跑.png');
  walkSheet = loadImage('2/走.png');
  jumpSheet = loadImage('2/跳.png');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  // 讓圖片繪製的基準點在圖片的中心，方便置中
  imageMode(CENTER);
  // 初始化角色位置在畫面中央
  characterX = width / 2;
  characterY = height / 2; // 角色Y軸位置保持不變，只做水平移動
}

function draw() {
  // 設定背景顏色
  background('#ffa200');

  // --- 畫格切割 ---
  // 切割跑步畫格 (只執行一次)
  if (runSheet.width > 0 && !runFramesLoaded) {
    for (let i = 0; i < runFrameCount; i++) {
      let frame = runSheet.get(i * runFrameWidth, 0, runFrameWidth, runSheetHeight);
      runFrames.push(frame);
    }
    runFramesLoaded = true;
  }

  // 切割走路畫格 (只執行一次)
  if (walkSheet.width > 0 && !walkFramesLoaded) {
    for (let i = 0; i < walkFrameCount; i++) {
      let frame = walkSheet.get(i * walkFrameWidth, 0, walkFrameWidth, walkSheetHeight);
      walkFrames.push(frame);
    }
    walkFramesLoaded = true;
  }

  // 切割跳躍畫格 (只執行一次)
  if (jumpSheet.width > 0 && !jumpFramesLoaded) {
    for (let i = 0; i < jumpFrameCount; i++) {
      let frame = jumpSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpSheetHeight);
      jumpFrames.push(frame);
    }
    jumpFramesLoaded = true;
  }

  // --- 繪製與動畫更新 ---
  // 確保所有畫格都已載入完成
  if (runFramesLoaded && walkFramesLoaded && jumpFramesLoaded) {
    let currentAnimationFrames;
    let currentFrameWidth;
    let animationSpeed;
    let currentFrameImage;

    // 根據角色狀態更新位置和動畫
    if (characterState === 'running') {
      currentAnimationFrames = runFrames;
      currentFrameWidth = runFrameWidth;
      animationSpeed = 4;
      currentFrameImage = runFrames[currentFrame];
      // 跑步時更新角色位置
      characterX += characterSpeed * characterDirection;
    } else if (characterState === 'walking') {
      currentAnimationFrames = walkFrames;
      currentFrameWidth = walkFrameWidth;
      animationSpeed = 6;
      currentFrameImage = walkFrames[currentFrame];
      // 走路時更新角色位置
      characterX += characterSpeed * characterDirection;
    } else if (characterState === 'jumping') {
      currentAnimationFrames = jumpFrames;
      currentFrameWidth = jumpFrameWidth;
      animationSpeed = 5; // 跳躍動畫速度
      currentFrameImage = jumpFrames[currentFrame];
      // 跳躍時角色位置保持不變
    } else { // 'idle' 狀態
      currentAnimationFrames = walkFrames; // 靜止時使用走路動畫
      currentFrameWidth = walkFrameWidth;
      currentFrame = 0; // 確保靜止時顯示第一個畫格
      currentFrameImage = walkFrames[0];
    }

    // 限制角色在畫布範圍內移動
    characterX = constrain(characterX, currentFrameWidth / 2, width - currentFrameWidth / 2);

    // --- 繪製角色 ---
    push(); // 儲存當前的繪圖狀態
    translate(characterX, characterY); // 將原點移動到角色的位置
    if (characterDirection === -1) { // 如果角色方向向左，則水平翻轉
      scale(-1, 1);
    }
    // 由於使用了 imageMode(CENTER) 和 translate，圖片會以 (0,0) 為中心繪製
    image(currentFrameImage, 0, 0);
    pop(); // 恢復之前的繪圖狀態

    // --- 更新動畫畫格 ---
    // 如果角色不是靜止狀態，才更新畫格
    if (characterState !== 'idle') {
      if (frameCount % animationSpeed === 0) {
        currentFrame = (currentFrame + 1) % currentAnimationFrames.length;
      }
    }
  }
}

// ... (windowResized 和 mousePressed 函式)

// 當視窗大小改變時，重新調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 當滑鼠被按下時會觸發此函式
function mousePressed() {
  // 確保畫格已載入，且按下的是滑鼠左鍵
  if (runFramesLoaded && walkFramesLoaded && jumpFramesLoaded) {
    if (mouseButton === LEFT) {
      // 按下左鍵，向左跑
      characterState = 'running';
      characterDirection = -1;
      currentFrame = 0;
    } else if (mouseButton === RIGHT) {
      // 按下右鍵，向右跑
      characterState = 'running';
      characterDirection = 1;
      currentFrame = 0;
    }
  }
}

// 當鍵盤被按下時會觸發此函式
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    // 如果按下左方向鍵，設定為走路狀態，方向向左
    characterState = 'walking';
    characterDirection = -1;
    currentFrame = 0;
  } else if (keyCode === RIGHT_ARROW) {
    // 如果按下右方向鍵，設定為走路狀態，方向向右
    characterState = 'walking';
    characterDirection = 1;
    currentFrame = 0;
  } else if (keyCode === UP_ARROW) {
    // 如果按下上方向鍵，設定為跳躍狀態
    characterState = 'jumping';
    currentFrame = 0;
  } else if (keyCode === DOWN_ARROW) {
    // 如果按下下方向鍵，停止跳躍，回到靜止狀態
    characterState = 'idle';
    currentFrame = 0;
  }
}

// 當鍵盤按鍵被放開時會觸發此函式
function keyReleased() {
  // 只有當放開的是左右方向鍵，並且角色當前是走路狀態時，才切換回靜止狀態
  if ((keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) && characterState === 'walking') {
    characterState = 'idle';
    currentFrame = 0; // 靜止時顯示走路動畫的第一個畫格
  }
}

// 當滑鼠按鍵被放開時會觸發此函式
function mouseReleased() {
  // 如果角色當前是跑步狀態，則切換回靜止狀態
  if (characterState === 'running') {
    characterState = 'idle';
    currentFrame = 0;
  }
}

// 防止在畫布上點擊右鍵時彈出選單
document.oncontextmenu = function() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
    return false;
}
