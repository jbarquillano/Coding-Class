//https://p5js.org/reference/p5/filter/
// https://p5js.org/reference/#/p5/loadImage
// https://p5js.org/reference/#/p5/createCanvas
// https://p5js.org/reference/#/p5/createImage
// https://p5js.org/reference/#/p5.Image/copy
// https://www.w3schools.com/jsref/met_document_getelementbyid.asp
// https://www.w3schools.com/jsref/met_element_addeventlistener.asp
// https://p5js.org/reference/#/p5/redraw
// https://p5js.org/reference/#/p5/windowResized
// https://p5js.org/reference/#/p5/resizeCanvas
// https://p5js.org/reference/#/p5.Image/resize
// For this assignment I first came across the p5 filters tutorial and after following that
// i had the idea to make a bootleg photoshop filter tool using different buttons so users could cycle through each of the filters
// it was a little tricky at first getting each of the buttons to work and change which required me to find and use the getelementbyID tutorials
// and the addeventlistener tutorials to get each of them to function how I intended them to
// after that the main problem was my image being way too big for the window size so I had to use the window resize and image resize tutorials
// to solve that issue






let originalImg; // keeps the first picture we load
let filteredImg; // this is the picture we mess with using filters
// let slider; // not using the slider anymore

// p5 ref: loadImage
// https://p5js.org/reference/#/p5/loadImage
// like the example, this loads the picture file before anything starts.
function preload(){
    originalImg = loadImage ('img/HOT-MESS-ALL-SCANS_Page_01_Image_0001.png')
}

function setup() {
    // p5 ref: p5.Image.resize
    // https://p5js.org/reference/#/p5.Image/resize
    // the example used set numbers (0, 100), but here we figure out the size
    // based on how big the window is, so it fits better.
    let aspectRatio = originalImg.height / originalImg.width; // keeps the picture shape
    let newWidth = windowWidth * 0.8; // make it 80% of the window's width
    let newHeight = newWidth * aspectRatio; // figure out height to keep shape
    originalImg.resize(newWidth, newHeight); // actually resize the picture

    // p5 ref: createCanvas
    // https://p5js.org/reference/#/p5/createCanvas
    // makes the drawing area the same size as our resized picture.
    createCanvas(originalImg.width, originalImg.height);

    // p5 ref: createImage
    // https://p5js.org/reference/#/p5/createImage
    // makes a new blank image to put the filtered version on.
    // p5 ref: p5.Image.copy
    // https://p5js.org/reference/#/p5.Image/copy
    // the example copies just a piece, but we copy the whole original picture
    // onto our blank filtered image.
    // this way, we don't mess up the original and can always go back to it.
    filteredImg = createImage(originalImg.width, originalImg.height);
    filteredImg.copy(originalImg, 0, 0, originalImg.width, originalImg.height, 0, 0, originalImg.width, originalImg.height);

    // js dom manipulation: getElementById
    // https://www.w3schools.com/jsref/met_document_getelementbyid.asp
    // this is how javascript finds html things using their id name.
    // js events: addEventListener
    // https://www.w3schools.com/jsref/met_element_addeventlistener.asp
    // the example connects a simple action, but here we connect our filter functions
    // (the ones below) to run when each button is clicked.
    document.getElementById('resetBtn').addEventListener('click', resetImage);
    document.getElementById('grayBtn').addEventListener('click', applyGray);
    document.getElementById('thresholdBtn').addEventListener('click', applyThreshold);
    document.getElementById('invertBtn').addEventListener('click', applyInvert);
    document.getElementById('posterizeBtn').addEventListener('click', applyPosterize);
    document.getElementById('blurBtn').addEventListener('click', applyBlur);
    document.getElementById('erodeBtn').addEventListener('click', applyErode);
    document.getElementById('dilateBtn').addEventListener('click', applyDilate);

    // p5 ref: image
    // https://p5js.org/reference/#/p5/image
    // like the example, this puts the starting picture (the copied one) on the screen.
    image(filteredImg, 0, 0);
    // noLoop(); // took this out so draw() keeps running, which lets redrawCanvas() work
}

function draw (){
    // p5 ref: image
    // https://p5js.org/reference/#/p5/image
    // draw() runs over and over, showing the current filteredImg.
    // so when a filter changes filteredImg, we see the change.
    image (filteredImg, 0, 0);
}

// --------------------- filter functions ----------------------

// p5 ref: p5.Image.copy
// https://p5js.org/reference/#/p5.Image/copy
// this function copies the original picture back onto filteredImg to undo filters.
function resetImage() {
  filteredImg.copy(originalImg, 0, 0, originalImg.width, originalImg.height, 0, 0, originalImg.width, originalImg.height);
  redrawCanvas(); // draw the picture again after resetting
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
  resetImage(); // start fresh
  filteredImg.filter(GRAY);
  redrawCanvas(); // show the change
}

// mode: threshold (makes it only black or white pixels)
function applyThreshold() {
  resetImage();
  filteredImg.filter(THRESHOLD); // the example used a slider, we just use the basic version
  redrawCanvas();
}

// mode: invert (flips the colors)
function applyInvert() {
  resetImage();
  filteredImg.filter(INVERT);
  redrawCanvas();
}

// mode: posterize (reduces the number of colors)
function applyPosterize() {
  resetImage();
  filteredImg.filter(POSTERIZE, 3); // example used mouse position, we just use 3 color levels
  redrawCanvas();
}

// mode: blur (makes it fuzzy)
function applyBlur() {
  resetImage();
  filteredImg.filter(BLUR, 3); // example used mouse position, we just use a blur level of 3
  redrawCanvas();
}

// mode: erode (thins out light areas)
// example used mouse click, we use a button click.
function applyErode() {
  resetImage();
  filteredImg.filter(ERODE);
  redrawCanvas();
}

// mode: dilate (fattens up light areas)
// example used mouse click, we use a button click.
function applyDilate() {
  resetImage();
  filteredImg.filter(DILATE);
  redrawCanvas();
}

// helper func to redraw the canvas
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
  let aspectRatio = originalImg.height / originalImg.width; // keep shape
  let newWidth = windowWidth * 0.8; // new width based on window
  let newHeight = newWidth * aspectRatio; // new height
  // p5 ref: resizeCanvas
  // https://p5js.org/reference/#/p5/resizeCanvas
  resizeCanvas(newWidth, newHeight); // resize the drawing area
  // p5 ref: p5.Image.resize
  // https://p5js.org/reference/#/p5.Image/resize
  originalImg.resize(newWidth, newHeight); // also resize the stored original image
  resetImage(); // copy the newly resized original -> filtered, then redraw
}