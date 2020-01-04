const population = new Population();
const game = new Game();

const bird_configs = {
    gravity: 0.6,
    lift: -14,
    air_res: 1
};

let birds = [];

// Note: The pipe, background and ground images are from Code Bullet, credit goes to him for those images.
// Note: The bird images and font are from https://flappybird.io/, credit goes to Max McDonnell @mxmcd for those images.
function preload() {
    backgroundImg = loadImage('images/background.png');
    birdFlappingUpImg = loadImage('images/birdFlappingUp.png');
    birdMidFlapImg = loadImage('images/birdMidFlap.png');
    birdFlappingDownImg = loadImage('images/birdFlappingDown.png');
    pipeHeadImg = loadImage('images/pipeHead0000.png');
    shaftImg = loadImage('images/shaft0000.png');
    groundImg = loadImage('images/groundPiece.png');
}

function setup(){
    population.init(NEAT_CONFIGS);
    population.initPopulation();

    for(let i=0; i<population.population.length; i++){
        let bird = new Bird(bird_configs.gravity, bird_configs.lift, bird_configs.air_res);
        bird.init(population.population[i]);
        birds.push(bird);
    }

    createCanvas(400, 600);
    background(0);

    game.init();
    game.setUpBirds(birds);
}

function draw(){
    image(backgroundImg, 0, 0, width, height);
    // Adding population generation
    textSize(30);
    text(`Gen: ${population.generation}`, width - 130, height - 90);
    fill(0);
    // Adding the score 
    textSize(30);
    text(`Score: ${game.score_show}`, width - 130, height - 50);
    fill(0);
    for(let i=0; i<5; i++){
        let is_done = game.updateFrame(birdFlappingUpImg, birdMidFlapImg, birdFlappingDownImg, pipeHeadImg, shaftImg);
        if(is_done){
            population.getNewPopulation();
            birds = [];
            for(let i=0; i<population.population.length; i++){
                let bird = new Bird(bird_configs.gravity, bird_configs.lift, bird_configs.air_res);
                bird.init(population.population[i]);
                birds.push(bird);
            }
            game.resetGame();
            game.setUpBirds(birds);
        }    
    }
}

let backgroundImg;
let birdFlappingUpImg;
let birdMidFlapImg;
let birdFlappingDownImg;
let pipeHeadImg;
let shaftImg;
let groundImg;