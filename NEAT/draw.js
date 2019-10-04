let population = new Population();

let total_pop = 200,
mutation_rate = 0.005;

population.init(total_pop, mutation_rate);
population.firstGen(5, 1);

// for(let genome of population.population){
//     genome.feedForward([1, 2, 3, 4]);
//     if(genome.node_list[4].getOutput() < 0.5){
//         console.log(genome);
//     }
// }

let genome = population.population[0];
console.log(genome);
// let new_node = new Node();
// new_node.init(6, 'hidden', 1);
// let new_connection_1 = new Connection(),
// new_connection_2 = new Connection();
// new_connection_1.init(1, 6, 0.5, true);
// new_connection_2.init(1, 4, 0.5, true);
// genome.connections_list[0].enabled = false;
// genome.connections_list[1].enabled = false;
// genome.connections_list[3].enabled = false;
// genome.connections_list[5].enabled = false;
// genome.connections_list.push(new_connection_1);
// genome.connections_list.push(new_connection_2);
// genome.node_list.push(new_node);

console.log(genome.node_list[4].getOutput());

function testGame(game, population){
    for(let i=0; i<game.birds.length; i++){
        console.log(population[i]);
        if(game.birds[i].enabled){
            population[i].feedForward([game.birds[i].y / 600, game.birds[i].vel, game.pipes[0].x / 400, game.pipes[0].top / 600, game.pipes[0].bottom / 600]);
            if(population[i].getOutput() > 0.9){
                game.birds[i].birdJump();
            }
        }
        else{
            population[i].score = game.birds[i].game_score;
        }
    }
}

// function testFunction(game, genome){
//     genome.feedForward([game.bird.y, game.bird.vel, game.pipes[0].x, game.pipes[0].top || 1, game.pipes[0].bottom || 1]);
//     if(genome.node_list[5].getOutput() > 0.85){
//         game.bird.birdJump();
//     }
// }

// Debugging
// let test_genome = new Genome();
// let test_inno = 1;
// let test_final_node_list = []
// let test_input_nodes = [];

// for(let i=0; i<3; i++){
//     let node = new Node();
//     node.init(i+1, 'input');
//     test_input_nodes.push(node);
//     test_final_node_list.push(node);
// }
// let test_output_nodes = [];
// for(let i=0; i<1; i++){
//     let index = test_final_node_list.length + i + 1;
//     let node = new Node();
//     node.init(index, 'output');
//     test_output_nodes.push(node);
//     test_final_node_list.push(node);
// }
// // let test_hidden_nodes = [];
// // for(let i=0; i<2; i++){
// //     let index = test_final_node_list.length + i + 1;
// //     let node = new Node();
// //     node.init(index, 'hidden');
// //     test_hidden_nodes.push(node);
// //     test_final_node_list.push(node);
// // }
// let connections_list = [];

// // Generating the starting connections
// for(let i=0; i<test_input_nodes.length; i++){
//     let input_node = test_input_nodes[i];
//     for(let j=0; j<test_output_nodes.length; j++){
//         let output_node = test_output_nodes[j];
//         let connection = new Connection();
//         let weight = (Math.random() * 4) - 2
//         connection.init(input_node.number, output_node.number, weight);
//         connection.setInnovationNumber(test_inno);
//         test_inno++;
//         connections_list.push(connection);
//     }
// }





function setup(){
    createCanvas(400, 600);
    Game.init();
    Game.setUpGame(population.population);
}

let check = false

function draw(){
    background(0);
    if(frameCount % 50 === 0){
        check = true
    }
    if(check && frameCount % 20 === 0){
        testGame(Game, population.population);
    }
    Game.updateFrame();
}

