function setup() {
  createCanvas(600, 600);
  noStroke();
}

function draw() {
  background(255);
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 8; col++) {
      let x = 50 + col * 70;
      let y = 50 + row * 100;
      
      if ((row + col) % 2 === 0) {
        fill(0, 50, 255);  // blue
      } else {
        fill(255, 50, 0);  // red
      }
      
      // circle properties
      circle(x, y, 40);
    }
  }
} 