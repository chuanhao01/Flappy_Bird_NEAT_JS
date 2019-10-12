let total_pop = 50, mutation_rate = 0.05;

let population = new Population();
population.init(total_pop, mutation_rate);

let game = new Game();

function setup(){
    createCanvas(400, 600);
    background(0);
    population.initPopualtion(4, 1);
    game.init();
    game.setUpBirds(population.population);

    // console.log(population.population[0].brain.feedForward)
    // let new_node_1 = new NodeGene();
    // new_node_1.init(6, 'hidden', 1);
    // population.population[0].brain.nodes_genes_list.push(new_node_1);
    // population.population[0].brain.feedForward([1, 2, 3, 4]);
}


function draw(){
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