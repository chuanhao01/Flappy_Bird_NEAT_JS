const population = new Population();
const game = new Game();

const WIDTH = 400,
HEIGHT = 600;

let best_player,
nv = new NEAT_VISUAL();

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

    createCanvas(2000, 2000);
    background(0);

    game.init();
    game.setUpBirds(birds);
}

function draw(){
    background(0);
    image(backgroundImg, 0, 0, WIDTH, HEIGHT);
    // Adding population generation
    textSize(30);
    fill(0);
    text(`Gen: ${population.generation}`, WIDTH - 130, HEIGHT - 90);
    // Adding the score 
    textSize(30);
    fill(0);
    text(`Score: ${game.score_show}`, WIDTH - 130, HEIGHT - 50);
    for(let i=0; i<1; i++){
        let is_done = game.updateFrame(birdFlappingUpImg, birdMidFlapImg, birdFlappingDownImg, pipeHeadImg, shaftImg);
        if(best_player){
            nv.getModelVisual();
        }
        if(is_done){
            // Drawing model
            best_player = population.getBestPlayer();
            nv.init(best_player, {
                'x': 0,
                'y': 650
            });
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