// gui elements
let colorSlider;
let sizeSlider;
let shapeSelect;
let colorValue;
let sizeValue;

// shape properties
let currentShape = 'circle';
let shapes = [];
let bgColor = 255;
let lastMouseX = 0;
let lastMouseY = 0;

function setup() {
    // create canvas
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    
    // create control groups
    let colorGroup = createDiv();
    colorGroup.parent('controls');
    colorGroup.class('control-group');
    
    let sizeGroup = createDiv();
    sizeGroup.parent('controls');
    sizeGroup.class('control-group');
    
    let shapeGroup = createDiv();
    shapeGroup.parent('controls');
    shapeGroup.class('control-group');
    
    // create color control
    createP('Color').parent(colorGroup).class('label');
    colorSlider = createSlider(0, 255, 150);
    colorSlider.parent(colorGroup);
    colorSlider.class('slider');
    
    // create size control
    createP('Size').parent(sizeGroup).class('label');
    sizeSlider = createSlider(10, 100, 50);
    sizeSlider.parent(sizeGroup);
    sizeSlider.class('slider');
    
    // create shape control
    createP('Shape').parent(shapeGroup).class('label');
    shapeSelect = createSelect();
    shapeSelect.parent(shapeGroup);
    shapeSelect.option('circle');
    shapeSelect.option('square');
    shapeSelect.option('triangle');
    shapeSelect.changed(updateShape);
}

function draw() {
    background(bgColor);
    
    // get current values
    colorValue = colorSlider.value();
    sizeValue = sizeSlider.value();
    
    // draw all shapes
    for (let shape of shapes) {
        fill(shape.color);
        if (shape.type === 'circle') {
            ellipse(shape.x, shape.y, shape.size, shape.size);
        } else if (shape.type === 'square') {
            rect(shape.x - shape.size/2, shape.y - shape.size/2, shape.size, shape.size);
        } else if (shape.type === 'triangle') {
            triangle(
                shape.x, shape.y - shape.size/2,
                shape.x - shape.size/2, shape.y + shape.size/2,
                shape.x + shape.size/2, shape.y + shape.size/2
            );
        }
    }
    
    // add new shape while mouse is pressed
    if (mouseIsPressed && (mouseX !== lastMouseX || mouseY !== lastMouseY)) {
        shapes.push({
            x: mouseX,
            y: mouseY,
            size: sizeValue,
            color: colorValue,
            type: currentShape
        });
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

// callback function for key press
function keyPressed() {
    // change bg color on key press
    if (key === ' ') {
        bgColor = random(255);
    }
}

// callback function for shape selection change
function updateShape() {
    // update current shape when selector changes
    currentShape = shapeSelect.value();
} 