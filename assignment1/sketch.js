function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('canvas-container');
    console.log("hi");
}

function draw() {
    fill(220, 220, 220, 50);
    rect(0, 0, width, height);
    fill(255, 60, 0);
    square(mouseX, mouseY, 50);
} 