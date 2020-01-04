const population = new Population();
const game = new Game();

const bird_configs = {
    gravity: 0.6,
    lift: -14,
    air_res: 1
};

let birds = [];


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
    background(0);
    let is_done = game.updateFrame();
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

