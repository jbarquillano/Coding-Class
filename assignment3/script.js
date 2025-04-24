let bgColor;

// text styles
let currentStyle1, currentStyle2;
let textStyles; 

let bgColorPicker; 
let textStyleDropdown1, textStyleDropdown2;
let textColorPicker1, textColorPicker2;

// x y pos sliders
let textXPositionSlider, textYPositionSlider;

function setup() {
  createCanvas(windowWidth-125, 580);
  
  // bg color picker
  bgColorPicker = createColorPicker('#dedede');
  bgColorPicker.position(1200, 600);
  
  // text1 props.
  textStyleDropdown1 = createSelect();
  textStyleDropdown1.option('Sans-Serif Bold');
  textStyleDropdown1.option('Serif Italic');
  textStyleDropdown1.option('Monospace Normal');
  textStyleDropdown1.option('Georgia BoldItalic');
  textStyleDropdown1.position(800, 675);
  
  textColorPicker1 = createColorPicker('#000000');
  textColorPicker1.position(800, 700);
  
  // text2 props.
  textStyleDropdown2 = createSelect();
  textStyleDropdown2.option('Sans-Serif Bold');
  textStyleDropdown2.option('Serif Italic');
  textStyleDropdown2.option('Monospace Normal');
  textStyleDropdown2.option('Georgia BoldItalic');
  textStyleDropdown2.position(1000, 675);
  
  textColorPicker2 = createColorPicker('#000000');
  textColorPicker2.position(1000, 700);
  
  // text1 input
  // input1 = createInput();
  // input1.position(800, 600);
  // textSizeSlider1 = createSlider(10, 400, 32);  // text size
  // textSizeSlider1.position(800, 625);
  // waveDistortionSlider = createSlider(0, 200, 10, 0.1); // wave distortion
  // waveDistortionSlider.position(800, 650);
  
  // text2 input
  input2 = createInput();
  input2.position(1000, 600);
  textSizeSlider2 = createSlider(10, 400, 32); // text size
  textSizeSlider2.position(1000, 625);
  randomnessSlider = createSlider(0, 20, 0, 1); // shaky
  randomnessSlider.position(1000, 650);
  
  // x y sliders
  textXPositionSlider = createSlider(0, windowWidth, windowWidth / 2); // x position
  textXPositionSlider.position(600, 600);
  textYPositionSlider = createSlider(0, 600, 300); // y position
  textYPositionSlider.position(600, 625);
}

function draw() {
  background(bgColorPicker.color());
  
  let textStr1 = input1.value();
  let textStr2 = input2.value();
  let textSizeValue1 = textSizeSlider1.value(); 
  let textSizeValue2 = textSizeSlider2.value(); 


  applySelectedTextStyle(1);
  textSize(textSizeValue1); // set size text1
  let textWidth1 = textStr1.split('').reduce((acc, char) => acc + textWidth(char), 0);
  let x1Start = textXPositionSlider.value() - textWidth1 / 2; 
  let yStart = textYPositionSlider.value(); 

  for (let i = 0; i < textStr1.length; i++) {
    let char = textStr1.charAt(i);
    let waveHeight = sin(frameCount * 0.05 + i * 0.2) * waveDistortionSlider.value(); // Wave effect
    text(char, x1Start, yStart + waveHeight);
    x1Start += textWidth(char); 
  }
  

  applySelectedTextStyle(2);
  textSize(textSizeValue2); // set size text2
  let textWidth2 = textStr2.split('').reduce((acc, char) => acc + textWidth(char), 0);
  let x2Start = textXPositionSlider.value() - textWidth2 / 2; 

  for (let i = 0; i < textStr2.length; i++) {
    let char = textStr2.charAt(i);
    let jitterX = random(-randomnessSlider.value(), randomnessSlider.value());
    let jitterY = random(-randomnessSlider.value(), randomnessSlider.value());
    text(char, x2Start + jitterX, yStart + jitterY); 
    x2Start += textWidth(char);
  }
}

// apply selected text styles
function applySelectedTextStyle(textNum) {
  let textStyleDropdown = textNum === 1 ? textStyleDropdown1 : textStyleDropdown2;
  let textColorPicker = textNum === 1 ? textColorPicker1 : textColorPicker2;
  
  let selectedStyle = textStyleDropdown.value();
  switch (selectedStyle) {
    case 'Sans-Serif Bold':
      textFont('sans-serif');
      textStyle(BOLD);
      break;
    case 'Serif Italic':
      textFont('serif');
      textStyle(ITALIC);
      break;
    case 'Monospace Normal':
      textFont('monospace');
      textStyle(NORMAL);
      break;
    case 'Georgia BoldItalic':
      textFont('Georgia');
      textStyle(BOLDITALIC);
      break;
  }
  
  fill(textColorPicker.color());
}

function keyPressed() {
    if (keyCode === DOWN_ARROW) {
        console.log('down arrow pressed');
        let save = confirm("Do you want to save the canvas as a PNG file?");
        if (save) {
            saveCanvas(input1.value().substring(0, 4) + "... + " + input2.value().substring(0, 4) + "... TEXT EDITED", 'png');
        }
    }
  }


  // references
  // https://editor.p5js.org/illus0r/sketches/m_1lNsw9s -- wavy text example
  // https://www.youtube.com/watch?v=PEO4fhXMQ9s -- more wavy text
  // https://www.w3schools.com/js/js_switch.asp -- switch statement
  // https://www.w3schools.com/java/ref_string_charat.asp -- charAt method
  // https://www.w3schools.com/jsref/jsref_reduce.asp -- reduce method

  // Joshua Reginales -- helped with some code

