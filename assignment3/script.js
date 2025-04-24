// typography variables
let canvas;
let textInput;
let fontSizeSlider;
let letterSpacingSlider;
let textColorPicker;
let bgColorPicker;
let fontFamilySelect;
let textAlignSelect;
let fullscreenBtn;

// setup function - runs once at the beginning
// see: https://p5js.org/reference/#/p5/setup
function setup() {
    canvas = createCanvas(windowWidth * 0.7, windowHeight);
    canvas.parent('canvas-container');
    
    // get control elements
    // see: https://www.w3schools.com/js/js_htmldom_elements.asp
    textInput = document.getElementById('text-input');
    fontSizeSlider = document.getElementById('font-size');
    letterSpacingSlider = document.getElementById('letter-spacing');
    textColorPicker = document.getElementById('text-color');
    bgColorPicker = document.getElementById('bg-color');
    fontFamilySelect = document.getElementById('font-family');
    textAlignSelect = document.getElementById('text-align');
    fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // add event listeners
    // see: https://www.w3schools.com/js/js_htmldom_eventlistener.asp
    textInput.addEventListener('input', function() {
    });
    
    fontSizeSlider.addEventListener('input', function() {
        document.getElementById('font-size-value').textContent = this.value;
    });
    
    letterSpacingSlider.addEventListener('input', function() {
        document.getElementById('letter-spacing-value').textContent = this.value;
    });
    
    textColorPicker.addEventListener('input', function() {
    });
    
    bgColorPicker.addEventListener('input', function() {
    });
    
    fontFamilySelect.addEventListener('change', function() {
    });
    
    textAlignSelect.addEventListener('change', function() {
    });
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // set initial values
    textInput.value = 'type something here...';
    
    // set initial text properties
    // see: https://p5js.org/reference/#/p5/textAlign
    textAlign(CENTER, CENTER);
    // see: https://p5js.org/reference/#/p5/textSize
    textSize(fontSizeSlider.value);
}

    function draw() {
    // set background color
    // see: https://p5js.org/reference/#/p5/background
    background(bgColorPicker.value);
    
    // get text and settings
    let textToDisplay = textInput.value;
    let letterSpacing = parseInt(letterSpacingSlider.value);
    let fontSize = parseInt(fontSizeSlider.value);
    
    // text settings - IMPORTANT: set these AFTER getting the values
    // see: https://p5js.org/reference/#/p5/textSize
    textSize(fontSize);
    // see: https://p5js.org/reference/#/p5/textAlign
    textAlign(textAlignSelect.value);
    // see: https://p5js.org/reference/#/p5/textFont
    textFont(fontFamilySelect.value);
    
    // draw text
    // see: https://p5js.org/reference/#/p5/fill
    fill(textColorPicker.value);
    // see: https://p5js.org/reference/#/p5/noStroke
    noStroke();
    
    // calculate text position
    let x = width / 2;
    let y = height / 2;
    
    // handle text alignment
    if (textAlignSelect.value === 'left') {
        x = 50;
    } else if (textAlignSelect.value === 'right') {
        x = width - 50;
    }
    
    // draw text with letter spacing
    if (letterSpacing !== 0) {
        // draw each character individually with spacing
        // see: https://www.w3schools.com/js/js_string_methods.asp
        let chars = textToDisplay.split('');
        let totalWidth = 0;
        
        // calculate total width for centering
        for (let i = 0; i < chars.length; i++) {
            // see: https://p5js.org/reference/#/p5/textWidth
            totalWidth += textWidth(chars[i]) + letterSpacing;
        }
        totalWidth -= letterSpacing; // remove last spacing
        
        // adjust x position for centering if needed
        let startX = x;
        if (textAlignSelect.value === 'center') {
            startX = x - totalWidth / 2;
        } else if (textAlignSelect.value === 'right') {
            startX = x - totalWidth;
        }
        
        // draw each character
        let currentX = startX;
        for (let i = 0; i < chars.length; i++) {
            // see: https://p5js.org/reference/#/p5/text
            text(chars[i], currentX, y);
            currentX += textWidth(chars[i]) + letterSpacing;
        }
    } else {
        // draw text normally if no letter spacing
        // see: https://p5js.org/reference/#/p5/text
        text(textToDisplay, x, y);
    }
}

// toggle fullscreen function
// see: https://www.w3schools.com/jsref/met_document_requestfullscreen.asp
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// window resize function
// see: https://p5js.org/reference/#/p5/windowResized
function windowResized() {
    resizeCanvas(windowWidth * 0.7, windowHeight);
} 