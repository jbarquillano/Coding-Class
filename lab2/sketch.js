// simple shape object
let shape = {
    x: 100,
    y: 200,
    size: 50,
    speed: 2
};

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(225);
    
    // update shape position
    shape.x += shape.speed;
    
    // bounce off edges
    if (shape.x > width - shape.size || shape.x < 0) {
        shape.speed *= -1;
    }
    
    // draw shape
    fill(255, 0, 0);
    circle(shape.x, shape.y, shape.size);
} 