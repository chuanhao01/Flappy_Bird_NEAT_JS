let total_pop = 100,
mutation_rate = 0.2;

let population = new Population();
population.init(total_pop, mutation_rate);

function setup(){
    createCanvas(400, 600);
    background(0);
    population.initPopulation(4, 1);

    // population.generateConnection(1, 2)
    // population.generateConnection(1, 3)
    // let a = population.generateConnection(1, 2)
    // console.log(population.global_connections_list)
    // a.weight = -2000;
    // console.log(a)

    // console.log(population.population[0].brain);

    population.population[0].think();
}

function draw(){

}