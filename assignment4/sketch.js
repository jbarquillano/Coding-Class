// refs:
// https://p5js.org/reference/#/p5/Array
// https://p5js.org/examples/simulate-particles.html

// particle system class
class ParticleSystem {
    constructor() {
        this.particles = []; // array of particle objects
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']; // array of colors
        this.lifespan = 255; // particle lifespan
    }

    // add new particle
    addParticle(x, y) {
        this.particles.push(new Particle(x, y, random(this.colors)));
    }

    // update and display particles
    run() {
        // loop through particles array in reverse to safely remove dead particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.run();
            if (p.isDead()) {
                // remove dead particles using splice
                this.particles.splice(i, 1);
            }
        }
    }
}

// particle class
class Particle {
    constructor(x, y, color) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-2, 2), random(-2, 2));
        this.acc = createVector(0, 0.05);
        this.color = color;
        this.lifespan = 255;
        this.size = 12; // size for triangle
    }

    // update particle
    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.lifespan -= 2;
    }

    // display particle
    display() {
        stroke(this.color);
        fill(this.color + hex(floor(this.lifespan), 2));
        
        // draw triangle
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading()); // rotate based on movement direction
        triangle(0, -this.size, -this.size/2, this.size/2, this.size/2, this.size/2);
        pop();
    }

    // check if particle is dead
    isDead() {
        return this.lifespan < 0;
    }

    // run particle
    run() {
        this.update();
        this.display();
    }
}

// global vars
let particleSystem;
let numbers = [1, 2, 3, 4, 5]; // simple number array
let words = ['hello', 'world', 'p5js', 'arrays']; // string array
let mixed = [1, 'two', 3.0, true, {x: 10, y: 20}]; // mixed type array

// dom elements
let particleCount;
let addButton;

function setup() {
    createCanvas(800, 600);
    particleSystem = new ParticleSystem();
    
    // demonstrate array methods
    console.log('joined words:', words.join(' ')); // join array elements
    console.log('concatenated arrays:', numbers.concat(words)); // combine arrays

    // get dom elements
    particleCount = select('#count');
    addButton = select('#addParticles');
    
    // add click event to button
    addButton.mousePressed(() => {
        for (let i = 0; i < 5; i++) {
            particleSystem.addParticle(random(width), random(height));
        }
    });
}

function draw() {
    background(240);
    
    // run particle system
    particleSystem.run();
    
    // update particle count in dom
    particleCount.html(particleSystem.particles.length);
}

function mousePressed() {
    // add new particles on mouse click
    for (let i = 0; i < 5; i++) {
        particleSystem.addParticle(mouseX, mouseY);
    }
} 