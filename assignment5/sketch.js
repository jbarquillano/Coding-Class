// Hey Adam! here are some helpful links i used to make this:

// p5 stuff i learned from:
// how to show images: https://p5js.org/reference/#/p5/image
// how to load pictures: https://p5js.org/reference/#/p5/loadImage
// cool filters you can use: https://p5js.org/reference/#/p5/filter
// making the drawing area: https://p5js.org/reference/#/p5/createCanvas
// making extra layers to draw on: https://p5js.org/reference/#/p5/createGraphics
// making images bigger/smaller: https://p5js.org/reference/#/p5.Image/resize
// drawing shapes like boxes n stuff: https://p5js.org/reference/#/p5/rect
// checking if someone clicked: https://p5js.org/reference/#/p5/mousePressed
// working with colors: https://p5js.org/reference/#/p5/color

// w3schools helped me figure out:
// how to upload files: https://www.w3schools.com/jsref/dom_obj_fileupload.asp
// making buttons do stuff: https://www.w3schools.com/js/js_htmldom_eventlistener.asp
// changing things on the page: https://www.w3schools.com/js/js_htmldom.asp
// drawing basics: https://www.w3schools.com/html/html5_canvas.asp
// text boxes n stuff: https://www.w3schools.com/jsref/dom_obj_text.asp
// picking colors: https://www.w3schools.com/jsref/dom_obj_color.asp
// those slider things: https://www.w3schools.com/jsref/dom_obj_range.asp

// other helpful stuff:
// mozilla's guide on drawing: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
// how to work with files: https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications

// cool stuff this can do:
// - upload pics and make them fit the screen
// - add filters to make pics look different
// - draw stuff with your mouse
// - draw shapes like boxes and circles
// - add text to your pictures
// - change colors and how see-through stuff is
// - works on phones too!

// for this assignment i first came across the p5 filters tutorial and after following that
// i had the idea to make a bootleg photoshop filter tool using different buttons so users could cycle through each of the filters for my previous assignment
// but I wanted to expand on it further and make it more interactive and fun for users so I added a bunch of other features
// it was a little tricky at first getting each of the buttons to work and change which required me to find and use the getelementbyID tutorials
// and the addeventlistener tutorials to get each of them to function how i intended them to
// after that the main problem was my image being way too big for the window size so i had to use the window resize and image resize tutorials
// to solve that issue which was a little tricky because i had to figure out how to make the image resize while keeping the aspect ratio

// My favorite part of the code!
// the calculateDimensions function below is my favorite because it solved a really tricky problem
// i spent hours trying to figure out why my images looked stretched or squished
// then i learned about aspect ratios and how to use Math.min to keep the proportions right
// it's super satisfying how this little function makes every image look perfect no matter the size
// plus i learned about object destructuring in javascript which was new to me!
// this is probably the most elegant solution i've written so far

function calculateDimensions(imgWidth, imgHeight, maxWidth, maxHeight) {
    let newWidth = imgWidth;
    let newHeight = imgHeight;
    
    // if image is larger than container, scale it down
    if (imgWidth > maxWidth || imgHeight > maxHeight) {
        const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        newWidth = imgWidth * ratio;
        newHeight = imgHeight * ratio;
    }
    
    return { width: newWidth, height: newHeight };
}

let originalImg; // keeps the first picture we load
let filteredImg; // this is the picture we mess with using filters
let drawingLayer; // new layer just for drawings
let previewLayer; // layer for shape preview
let lastX, lastY;
let startX, startY; // for shape drawing
let isDrawMode = false;
let drawColor;
let brushSize;
let fillOpacity;
let currentShape = 'freehand';

// store the last applied filter for threshold updates
let lastFilter = null;
let lastFilterValue = null;

let preThresholdState; // store the image state before threshold

let fontSize = 16;
let textBoxStart = null;
let textBoxSize = null;
let activeTextBox = null;

// p5 ref: loadImage
// https://p5js.org/reference/#/p5/loadImage
function preload(){
    originalImg = loadImage ('hot-mess-a1.jpg')
}

function setup() {
    // calculate canvas size based on viewport and aspect ratio
    const canvasContainer = document.getElementById('canvas-container');
    const containerWidth = canvasContainer.offsetWidth;
    const containerHeight = canvasContainer.offsetHeight;
    
    // calculate dimensions maintaining aspect ratio
    const dimensions = calculateDimensions(
        originalImg.width,
        originalImg.height,
        containerWidth,
        containerHeight
    );
    
    // resize original image
    originalImg.resize(dimensions.width, dimensions.height);
    
    // create and position canvas
    const canvas = createCanvas(dimensions.width, dimensions.height);
    canvas.parent('canvas-container');
    
    // setup filtered image and drawing layers
    filteredImg = createImage(dimensions.width, dimensions.height);
    drawingLayer = createGraphics(dimensions.width, dimensions.height);
    previewLayer = createGraphics(dimensions.width, dimensions.height);
    drawingLayer.clear();
    previewLayer.clear();
    
    // copy original to filtered
    resetImage();

    // add event listeners
    document.getElementById('resetBtn').addEventListener('click', resetImage);
    document.getElementById('grayBtn').addEventListener('click', applyGray);
    document.getElementById('invertBtn').addEventListener('click', applyInvert);
    document.getElementById('posterizeBtn').addEventListener('click', applyPosterize);
    document.getElementById('blurBtn').addEventListener('click', applyBlur);
    document.getElementById('erodeBtn').addEventListener('click', applyErode);
    document.getElementById('dilateBtn').addEventListener('click', applyDilate);

    // add event listener for image upload
    document.getElementById('imgUpload').addEventListener('change', handleImageUpload);
    
    // add drawing controls listeners
    document.getElementById('drawBtn').addEventListener('click', toggleDrawMode);
    document.getElementById('colorPicker').addEventListener('input', updateDrawColor);
    document.getElementById('brushSize').addEventListener('input', updateBrushSize);
    
    // add slider listener
    const thresholdSlider = document.getElementById('thresholdSlider');
    const thresholdValue = document.querySelector('.threshold-value');
    
    thresholdSlider.addEventListener('input', function() {
        thresholdValue.textContent = this.value;
        applyThreshold();
    });
    
    // add brush size value display
    const brushSizeSlider = document.getElementById('brushSize');
    const brushSizeValue = document.querySelector('.brush-size-value');
    brushSizeSlider.addEventListener('input', function() {
        brushSize = parseInt(this.value);
        brushSizeValue.textContent = brushSize + 'px';
    });
    
    // add fill opacity value display
    const fillOpacitySlider = document.getElementById('fillOpacity');
    const fillOpacityValue = document.querySelector('.fill-opacity-value');
    fillOpacitySlider.addEventListener('input', function() {
        fillOpacity = parseInt(this.value);
        const percentage = Math.round((fillOpacity / 255) * 100);
        fillOpacityValue.textContent = percentage + '%';
    });
    
    // add shape control listeners
    document.getElementById('freehandBtn').addEventListener('click', () => setShape('freehand'));
    document.getElementById('lineBtn').addEventListener('click', () => setShape('line'));
    document.getElementById('rectBtn').addEventListener('click', () => setShape('rect'));
    document.getElementById('circleBtn').addEventListener('click', () => setShape('circle'));
    
    // add fill opacity listener
    document.getElementById('fillOpacity').addEventListener('input', updateFillOpacity);
    
    // add text controls listeners
    document.getElementById('textboxBtn').addEventListener('click', () => setShape('textbox'));
    
    const fontSizeSlider = document.getElementById('fontSize');
    const fontSizeValue = document.querySelector('.font-size-value');
    
    fontSizeSlider.addEventListener('input', function() {
        fontSize = parseInt(this.value);
        fontSizeValue.textContent = fontSize + 'px';
        if (activeTextBox) {
            updateTextPreview();
        }
    });
    
    document.getElementById('textInput').addEventListener('input', function() {
        if (activeTextBox) {
            updateTextPreview();
        }
    });
    
    // initialize drawing values
    drawColor = color(document.getElementById('colorPicker').value);
    brushSize = parseInt(document.getElementById('brushSize').value);
    fillOpacity = parseInt(document.getElementById('fillOpacity').value);
    
    // draw initial image
    image(filteredImg, 0, 0);
}

function draw() {
    // show current filtered image with drawings
    image(filteredImg, 0, 0);
    image(drawingLayer, 0, 0);
    image(previewLayer, 0, 0);
    
    if (isDrawMode && mouseIsPressed && mouseButton === LEFT) {
        // ensure drawing stays within canvas bounds
        if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
            if (currentShape === 'freehand') {
                drawFreehand();
            } else {
                updatePreview();
            }
        }
    }
}

function drawFreehand() {
    if (lastX && lastY) {
        drawingLayer.stroke(drawColor);
        drawingLayer.strokeWeight(brushSize);
        drawingLayer.line(lastX, lastY, mouseX, mouseY);
    }
    
    drawingLayer.noStroke();
    drawingLayer.fill(drawColor);
    drawingLayer.circle(mouseX, mouseY, brushSize);
    
    lastX = mouseX;
    lastY = mouseY;
}

function updatePreview() {
    previewLayer.clear();
    previewLayer.stroke(drawColor);
    previewLayer.strokeWeight(brushSize);
    
    // set fill color with opacity
    const fillColorWithOpacity = color(red(drawColor), green(drawColor), blue(drawColor), fillOpacity);
    previewLayer.fill(fillColorWithOpacity);
    
    switch(currentShape) {
        case 'line':
            previewLayer.line(startX, startY, mouseX, mouseY);
            break;
        case 'rect':
            previewLayer.rect(
                min(startX, mouseX),
                min(startY, mouseY),
                abs(mouseX - startX),
                abs(mouseY - startY)
            );
            break;
        case 'circle':
            const diameter = dist(startX, startY, mouseX, mouseY) * 2;
            previewLayer.ellipse(startX, startY, diameter, diameter);
            break;
        case 'textbox':
            if (textBoxStart) {
                const x = min(textBoxStart.x, mouseX);
                const y = min(textBoxStart.y, mouseY);
                const w = abs(mouseX - textBoxStart.x);
                const h = abs(mouseY - textBoxStart.y);
                
                // draw text box preview
                previewLayer.stroke(255);
                previewLayer.strokeWeight(1);
                previewLayer.noFill();
                previewLayer.rect(x, y, w, h);
                
                textBoxSize = { x, y, w, h };
            }
            break;
    }
}

function mousePressed() {
    if (isDrawMode && mouseButton === LEFT) {
        if (currentShape === 'textbox') {
            // Only start new text box if we don't have an active one
            if (!activeTextBox) {
                textBoxStart = { x: mouseX, y: mouseY };
            }
        } else {
            startX = mouseX;
            startY = mouseY;
            lastX = mouseX;
            lastY = mouseY;
        }
    }
}

function mouseReleased() {
    if (isDrawMode) {
        if (currentShape === 'textbox' && textBoxStart) {
            // Only create text box if dragged at least 20 pixels
            const dragDistance = dist(textBoxStart.x, textBoxStart.y, mouseX, mouseY);
            if (dragDistance > 20) {
                if (textBoxSize) {
                    // show text input controls
                    const textControls = document.querySelector('.text-controls');
                    textControls.style.display = 'flex';
                    
                    // focus text input
                    const textInput = document.getElementById('textInput');
                    textInput.value = '';
                    textInput.focus();
                    
                    // store active text box
                    activeTextBox = {
                        x: textBoxSize.x,
                        y: textBoxSize.y,
                        width: textBoxSize.w,
                        height: textBoxSize.h
                    };
                    
                    updateTextPreview();
                }
            }
        } else if (currentShape !== 'freehand') {
            // draw the final shape on the drawing layer
            drawingLayer.stroke(drawColor);
            drawingLayer.strokeWeight(brushSize);
            
            // set fill color with opacity
            const fillColorWithOpacity = color(red(drawColor), green(drawColor), blue(drawColor), fillOpacity);
            drawingLayer.fill(fillColorWithOpacity);
            
            switch(currentShape) {
                case 'line':
                    drawingLayer.line(startX, startY, mouseX, mouseY);
                    break;
                case 'rect':
                    drawingLayer.rect(
                        min(startX, mouseX),
                        min(startY, mouseY),
                        abs(mouseX - startX),
                        abs(mouseY - startY)
                    );
                    break;
                case 'circle':
                    const diameter = dist(startX, startY, mouseX, mouseY) * 2;
                    drawingLayer.ellipse(startX, startY, diameter, diameter);
                    break;
            }
        }
        
        // clear preview if we're not in an active text box
        if (!activeTextBox) {
            previewLayer.clear();
        }
    }
    
    // reset positions
    lastX = null;
    lastY = null;
    startX = null;
    startY = null;
    textBoxStart = null;
    textBoxSize = null;
}

function setShape(shape) {
    if (shape !== 'textbox' && currentShape === 'textbox') {
        // hide text controls when switching away from textbox
        document.querySelector('.text-controls').style.display = 'none';
        // clear any active text box
        activeTextBox = null;
        previewLayer.clear();
    }
    
    currentShape = shape;
    
    // update button states
    const buttons = ['freehandBtn', 'lineBtn', 'rectBtn', 'circleBtn', 'textboxBtn'];
    buttons.forEach(btn => {
        document.getElementById(btn).classList.remove('active');
    });
    document.getElementById(shape + 'Btn').classList.add('active');
    
    // show text controls if textbox selected
    if (shape === 'textbox') {
        document.querySelector('.text-controls').style.display = 'flex';
    }
}

function updateFillOpacity() {
    fillOpacity = parseInt(document.getElementById('fillOpacity').value);
}

// --------------------- filter functions ----------------------

// p5 ref: p5.Image.copy
// https://p5js.org/reference/#/p5.Image/copy
// this function copies the original picture back onto filteredImg to undo filters.
function resetImage() {
    // clear stored threshold state
    preThresholdState = null;
    
  filteredImg.copy(originalImg, 0, 0, originalImg.width, originalImg.height, 0, 0, originalImg.width, originalImg.height);
    drawingLayer.clear();
    previewLayer.clear();
    redrawCanvas();
}

// p5 ref: filter
// https://p5js.org/reference/#/p5/filter
// the p5 example puts filters right in draw().
// but here, we put the filter on the copied picture (filteredImg)
// inside these little functions that run when buttons are clicked.
// this stops filters from stacking up on top of each other.
// each filter function resets first, then adds just its own filter.

// mode: gray (makes it black and white)
function applyGray() {
    preThresholdState = null;
    applyFilter(GRAY);
}

// mode: threshold (makes it only black or white pixels)
function applyThreshold() {
    const thresholdValue = document.getElementById('thresholdSlider').value;
    
    // if we haven't stored the pre-threshold state yet, store it
    if (!preThresholdState) {
        preThresholdState = createImage(width, height);
        preThresholdState.copy(filteredImg, 0, 0, width, height, 0, 0, width, height);
    }
    
    // restore the pre-threshold state before applying new threshold
    filteredImg.copy(preThresholdState, 0, 0, width, height, 0, 0, width, height);
    
    // apply threshold filter
    filteredImg.filter(THRESHOLD, thresholdValue / 255);
  redrawCanvas();
}

// mode: invert (flips the colors)
function applyInvert() {
    preThresholdState = null;
    applyFilter(INVERT);
}

// mode: posterize (reduces the number of colors)
function applyPosterize() {
    preThresholdState = null;
    applyFilter(POSTERIZE, 3);
}

// mode: blur (makes it fuzzy)
function applyBlur() {
    preThresholdState = null;
    applyFilter(BLUR, 3);
}

// mode: erode (thins out light areas)
function applyErode() {
    preThresholdState = null;
    applyFilter(ERODE);
}

// mode: dilate (fattens up light areas)
function applyDilate() {
    preThresholdState = null;
    applyFilter(DILATE);
}

// helper function to redraw the canvas
// p5 ref: redraw
// https://p5js.org/reference/#/p5/redraw
// we call redraw() after adding a filter so the screen updates right away.
// the example uses it with noLoop(), but here it just makes sure the drawing happens quickly, even though draw() is running all the time.
function redrawCanvas() {
  redraw();
}

// Optional: resize canvas when window is resized
// p5 ref: windowResized
// https://p5js.org/reference/#/p5/windowResized
// p5 automatically runs this code if the browser window size changes.
// the example just resized the canvas.
// here, we figure out the new image size based on the new window width, then resize the canvas and the original picture, then reset and redraw everything.
function windowResized() {
    const canvasContainer = document.getElementById('canvas-container');
    const containerWidth = canvasContainer.offsetWidth;
    const containerHeight = canvasContainer.offsetHeight;
    
    // calculate new dimensions
    const dimensions = calculateDimensions(
        originalImg.width,
        originalImg.height,
        containerWidth,
        containerHeight
    );
    
    // resize canvas and layers
    resizeCanvas(dimensions.width, dimensions.height);
    
    // resize image maintaining aspect ratio
    originalImg.resize(dimensions.width, dimensions.height);
    
    // recreate layers at new size
    filteredImg = createImage(dimensions.width, dimensions.height);
    drawingLayer = createGraphics(dimensions.width, dimensions.height);
    previewLayer = createGraphics(dimensions.width, dimensions.height);
    
    // reset and redraw
    resetImage();
}

// handle image upload with separate drawing layer
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            loadImage(event.target.result, function(img) {
                originalImg = img;
                preThresholdState = null;
                
                // get container dimensions
                const canvasContainer = document.getElementById('canvas-container');
                const containerWidth = canvasContainer.offsetWidth;
                const containerHeight = canvasContainer.offsetHeight;
                
                // calculate new dimensions
                const dimensions = calculateDimensions(
                    originalImg.width,
                    originalImg.height,
                    containerWidth,
                    containerHeight
                );
                
                // resize image and canvas
                originalImg.resize(dimensions.width, dimensions.height);
                resizeCanvas(dimensions.width, dimensions.height);
                
                // create new layers at new size
                filteredImg = createImage(dimensions.width, dimensions.height);
                drawingLayer = createGraphics(dimensions.width, dimensions.height);
                previewLayer = createGraphics(dimensions.width, dimensions.height);
                
                // clear and reset
                drawingLayer.clear();
                previewLayer.clear();
                resetImage();
            });
        };
        reader.readAsDataURL(file);
    }
}

// toggle draw mode on/off
function toggleDrawMode() {
    isDrawMode = !isDrawMode;
    const drawBtn = document.getElementById('drawBtn');
    if (isDrawMode) {
        drawBtn.classList.add('active');
        cursor('crosshair');
    } else {
        drawBtn.classList.remove('active');
        cursor(ARROW);
        // reset last position when exiting draw mode
        lastX = null;
        lastY = null;
    }
}

// update drawing color from color picker
function updateDrawColor() {
    drawColor = color(document.getElementById('colorPicker').value);
}

// update brush size from slider
function updateBrushSize() {
    brushSize = parseInt(document.getElementById('brushSize').value);
}

// prevent default touch behavior to allow drawing on mobile
function touchStarted() {
    if (isDrawMode) {
        return false;
    }
}

function touchMoved() {
    if (isDrawMode) {
        return false;
    }
}

// Another cool part - how i made filters stack
// this was tricky because at first the filters would just replace each other
// then i figured out i needed to:
// 1. keep the original image safe (originalImg)
// 2. make a separate image to add filters to (filteredImg)
// 3. copy any drawings to a special layer (drawingLayer)
// 4. combine everything when applying a new filter
// 
// here are the tutorials that helped me figure this out:
// - how to use p5 filters: https://p5js.org/reference/#/p5/filter
// - creating graphics buffers: https://p5js.org/reference/#/p5/createGraphics
// - copying images: https://p5js.org/reference/#/p5.Image/copy
// - making new images: https://p5js.org/reference/#/p5/createImage
// 
// i also found these really helpful:
// - understanding canvas layers: https://www.w3schools.com/tags/canvas_drawimage.asp
// - working with multiple canvases: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing
// 
// the really cool part is in the applyFilter function below
// it takes all the separate pieces (filtered image + drawings)
// combines them into one temporary image
// applies the new filter
// and keeps the drawings separate so you can keep drawing!
// 
// i learned this the hard way - first i tried applying filters directly
// but that would mess up the colors of anything i drew
// this way is much better because you can:
// - stack multiple filters
// - keep drawing
// - undo filters by resetting
// - maintain quality even with multiple filters

function applyFilter(filterType, value = null) {
    // if applying a non-threshold filter, clear the stored threshold state
    if (filterType !== THRESHOLD) {
        preThresholdState = null;
    }
    
    // create temporary graphics to combine image and drawings
    let tempGraphics = createGraphics(width, height);
    tempGraphics.image(filteredImg, 0, 0);
    tempGraphics.image(drawingLayer, 0, 0);
    
    // create new filtered image
    filteredImg = createImage(width, height);
    filteredImg.copy(tempGraphics, 0, 0, width, height, 0, 0, width, height);
    
    // apply filter
    if (value !== null) {
        filteredImg.filter(filterType, value);
    } else {
        filteredImg.filter(filterType);
    }
    
    // clear drawing layer since drawings are now part of filtered image
    drawingLayer.clear();
    
    redrawCanvas();
}

function updateTextPreview() {
    if (!activeTextBox) return;
    
    previewLayer.clear();
    
    // draw box outline
    previewLayer.stroke(255);
    previewLayer.strokeWeight(1);
    previewLayer.noFill();
    previewLayer.rect(activeTextBox.x, activeTextBox.y, activeTextBox.width, activeTextBox.height);
    
    // set text properties
    previewLayer.textSize(fontSize);
    previewLayer.textAlign(LEFT, TOP);
    previewLayer.fill(drawColor);
    previewLayer.noStroke();
    
    // get text and add padding
    const padding = 8;
    const maxWidth = activeTextBox.width - (padding * 2);
    const text = document.getElementById('textInput').value || 'Enter text';
    const words = text.split(' ');
    let line = '';
    let y = activeTextBox.y + padding;
    let x = activeTextBox.x + padding;
    
    // word wrap with padding
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = line + word + ' ';
        const testWidth = previewLayer.textWidth(testLine);
        
        if (testWidth > maxWidth) {
            previewLayer.text(line, x, y);
            line = word + ' ';
            y += fontSize + 2; // add small line spacing
            
            // check if we've exceeded the box height with padding
            if (y + fontSize > activeTextBox.y + activeTextBox.height - padding) {
                // add ellipsis if there's more text
                if (i < words.length - 1) {
                    let ellipsis = '...';
                    while (previewLayer.textWidth(line + ellipsis) > maxWidth) {
                        line = line.slice(0, -1);
                    }
                    previewLayer.text(line + ellipsis, x, y - (fontSize + 2));
                }
                break;
            }
        } else {
            line = testLine;
        }
    }
    // draw remaining text if within bounds
    if (y + fontSize <= activeTextBox.y + activeTextBox.height - padding) {
        previewLayer.text(line, x, y);
    }
}

function finalizeText() {
    if (activeTextBox && document.getElementById('textInput').value.trim()) {
        // draw the text on the drawing layer
        drawingLayer.textSize(fontSize);
        drawingLayer.textAlign(LEFT, TOP);
        drawingLayer.fill(drawColor);
        drawingLayer.noStroke();
        
        const padding = 8;
        const maxWidth = activeTextBox.width - (padding * 2);
        const text = document.getElementById('textInput').value;
        const words = text.split(' ');
        let line = '';
        let y = activeTextBox.y + padding;
        let x = activeTextBox.x + padding;
        
        // word wrap with padding
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = line + word + ' ';
            const testWidth = drawingLayer.textWidth(testLine);
            
            if (testWidth > maxWidth) {
                drawingLayer.text(line, x, y);
                line = word + ' ';
                y += fontSize + 2; // add small line spacing
                
                // check if we've exceeded the box height with padding
                if (y + fontSize > activeTextBox.y + activeTextBox.height - padding) {
                    // add ellipsis if there's more text
                    if (i < words.length - 1) {
                        let ellipsis = '...';
                        while (drawingLayer.textWidth(line + ellipsis) > maxWidth) {
                            line = line.slice(0, -1);
                        }
                        drawingLayer.text(line + ellipsis, x, y - (fontSize + 2));
                    }
                    break;
                }
            } else {
                line = testLine;
            }
        }
        // draw remaining text if within bounds
        if (y + fontSize <= activeTextBox.y + activeTextBox.height - padding) {
            drawingLayer.text(line, x, y);
        }
        
        // clear preview and reset
        previewLayer.clear();
        activeTextBox = null;
        document.getElementById('textInput').value = '';
        
        // hide text controls
        document.querySelector('.text-controls').style.display = 'none';
    }
}

// Add click outside handler to finalize text
document.addEventListener('mousedown', function(e) {
    if (activeTextBox) {
        // Check if click is outside the text controls and canvas
        const textControls = document.querySelector('.text-controls');
        const canvas = document.querySelector('canvas');
        if (!textControls.contains(e.target) && !canvas.contains(e.target)) {
            finalizeText();
        }
    }
});