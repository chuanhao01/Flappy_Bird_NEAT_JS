let total_pop = 50, mutation_rate = 0.05;

let population = new Population();
population.init(total_pop, mutation_rate);

let game = new Game();
let player_bird; 

function setup(){
    createCanvas(400, 600);
    background(0);
    population.initPopualtion(7, 1);
    game.init();
    // player_bird = new Bird(0.6, -20, 0.9);
    // game.setUpBirds([player_bird]);

    game.setUpBirds(population.population);

    // console.log(population.population[0].brain.feedForward)
    // let new_node_1 = new NodeGene();
    // new_node_1.init(6, 'hidden', 1);
    // population.population[0].brain.nodes_genes_list.push(new_node_1);
    // population.population[0].brain.feedForward([1, 2, 3, 4]);
}


function draw(){
    if(population.generation < 10){
        for(let i=0; i<200; i++){
            background(0);
            let is_done = game.updateFrame();
            if(is_done){
                population.generateSpecies();
                population.sortSpecies();
                population.prunePopulation();
                population.calculateSpecificFitness();
                population.generateMatingPool();
                population.crossoverPopulation();
                population.mutateCrossoverPopulation();
                game.resetGame();
                game.setUpBirds(population.population);
            }
        }
    }
    else{
        background(0);
        let is_done = game.updateFrame();
        if(is_done){
            population.generateSpecies();
            population.sortSpecies();
            population.prunePopulation();
            population.calculateSpecificFitness();
            population.generateMatingPool();
            population.crossoverPopulation();
            population.mutateCrossoverPopulation();
            game.resetGame();
            game.setUpBirds(population.population);
        } 
    }
}

function keyPressed(){
    if(key === ' '){
        player_bird.birdJump();
    }
}