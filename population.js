function Population(){
    this.init = function(total_pop, mutation_rate){
        this.total_pop = total_pop;
        this.mutation_rate = mutation_rate;
        this.global_innovation_number = 1;
        this.global_node_number = 1;
        this.global_connections_list = [];
        this.global_mutation = [];
        this.population = [];
        this.species = [];
        this.mating_pool = [];
        this.c1 = 1;
        this.c2 = 1;
        this.c3 = 1;
        this.compatibility_threshold = 2;
        this.prune_percentage = 0.15;
        this.generation = 1;
        // For generating the first generation
    };
    this.firstGen = function(input_nodes, output_nodes){
        let starting_nodes_list = [];
        let input_nodes_list = [],
        output_nodes_list = [];
        // Getting the input nodes
        for(let i=0; i<input_nodes; i++){
            let node = new Node();
            node.init(i+1, 'input', 0);
            input_nodes_list.push(node);
            starting_nodes_list.push(node);
            this.global_node_number++;
        }
        // Getting the output nodes
        for(let i=0; i<output_nodes; i++){
            let node = new Node();
            let node_number = input_nodes + i + 1;
            node.init(node_number, 'output', -1);
            output_nodes_list.push(node);
            starting_nodes_list.push(node);
            this.global_node_number++;
        }
        let population = [];
        for(let pop_index=0; pop_index<this.total_pop; pop_index++){
            let starting_connections_list = [];
            for(let i=0; i<input_nodes; i++){
                let input_node = input_nodes_list[i];
                for(let j=0; j<output_nodes; j++){
                    let output_node = output_nodes_list[j];
                    let connection = this.generateConnection(input_node.node_number, output_node.node_number);
                    // console.log(connection)
                    starting_connections_list.push(connection);
                }
            }
            let gravity = 0.6,
            lift = -20,
            air_res = 0.9;
            let bird = new Bird(gravity, lift, air_res);
            bird.generateBrain(true, {
                mutation_rate: this.mutation_rate,
                nodes_list: starting_nodes_list,
                connections_list: starting_connections_list,
            });
            population.push(bird);
        }
        this.population = population;
    };
    this.generateConnection = function(in_node, out_node){
        if(this.global_connections_list.length < 1){
            let connection = new Connection();
            let weight = (Math.random() * 4) - 2
            connection.init(in_node, out_node, weight, true);
            connection.setInnovationNumber(this.global_innovation_number);
            this.global_innovation_number++;
            this.global_connections_list.push(connection);
            return connection;
        }
        else{
            let is_new = true;
            let new_connection; 
            for(let connection of this.global_connections_list){
                if(connection.in_node === in_node && connection.out_node === out_node){
                    is_new = false;
                    new_connection = connection.copy();
                    let new_weight = (Math.random() * 4) - 2;
                    new_connection.weight = new_weight;
                }
            }
            if(is_new){
                new_connection = new Connection();
                let new_weight = (Math.random() * 4) - 2;
                new_connection.init(in_node, out_node, new_weight, true);
                new_connection.setInnovationNumber(this.global_innovation_number);
                this.global_connections_list.push(new_connection);
                this.global_innovation_number++;
            }
            return new_connection;
        }
         
    };
    this.getDistance = function(genome_a, genome_b){
        let different_connections = 0,
        total_w_diff = 0;
        let a_index = 0, 
        b_index = 0;
        let a_connections = genome_a.connections_list,
        b_connections = genome_b.connections_list;
        let a_connection_len = a_connections.length,
        b_connection_len = b_connections.length;
        let same_connections_number = 0;
        // console.log('I should be ending my life after this')
        while(true){
            if(a_index === a_connection_len && b_index === b_connection_len){
                break;
            }
            else if(a_index === a_connection_len){
                if(a_connections[a_index - 1].innovation_number === b_connections[b_index].innovation_number){
                    total_w_diff = Math.abs(a_connections[a_index - 1].weight - b_connections[b_index].weight);
                    b_index++;
                    same_connections_number++;
                }
                else{
                    different_connections++;
                    b_index++;
                }
            }
            else if(b_index === b_connection_len){
                if(a_connections[a_index].innovation_number === b_connections[b_index - 1].innovation_number){
                    total_w_diff = Math.abs(a_connections[a_index].weight - b_connections[b_index - 1].weight);
                    a_index++;
                    same_connections_number++;
                }
                else{
                    different_connections++;
                    a_index++;
                }
            }
            if(a_index !== a_connection_len && b_index !== b_connection_len){
                if(a_connections[a_index].innovation_number === b_connections[b_index].innovation_number){
                    total_w_diff = Math.abs(a_connections[a_index].weight - b_connections[b_index].weight);
                    a_index++;
                    b_index++;
                    same_connections_number++;
                }
                else if(a_connections[a_index].innovation_number < b_connections[b_index].innovation_number){
                    different_connections++;
                    a_index++;
                }
                else if(a_connections[a_index].innovation_number > b_connections[b_index].innovation_number){
                    different_connections++;
                    b_index++;
                }
            }
        }
        // console.log('i hate the end of timeeee')
        let N = 1;
        if(a_connection_len >= 20 || b_connection_len >= 20){
            if(a_connection_len >= b_connection_len){
                N = a_connection_len;
            }
            else{
                N = b_connection_len;
            }
        }
        let distance = ((this.c1 * different_connections)/N) + (this.c3 * (total_w_diff / same_connections_number));
        return distance;

    };
    // this.getDistance = function(genome_a, genome_b){
    //     // console.log('hello 1212')
    //     let disjoint = 0,
    //     excess = 0,
    //     total_w_diff = 0;
    //     let a_index = 0, 
    //     b_index = 0;
    //     let a_connections = genome_a.connections_list,
    //     b_connections = genome_b.connections_list;
    //     let a_connection_len = a_connections.length,
    //     b_connection_len = b_connections.length;
    //     let same_connections_number = 0;
    //     while(true){
    //         // console.log(a_connections);
    //         // console.log(a_connections[a_index].innovation_number, 'i will be back')
    //         // console.log(b_connections[b_index].innovation_number, 'I am beeee')
    //         // console.log(a_index, b_index)
    //         // // console.log(a_connection_len-1, 'he')
    //         // console.log('hello 9000')
    //         // console.log(a_index, a_connection_len, 'nnananan')
    //         // console.log(b_index, b_connection_len, 'nbnbnbnbnb');
    //         if(a_index !== a_connection_len && b_index !== b_connection_len){
    //             // console.log('inside')
    //             // console.log(a_index, a_connection_len, 'nnananan')
    //             // console.log(b_index, b_connection_len, 'nbnbnbnbnb');
    //             if(a_connections[a_index].innovation_number === b_connections[b_index].innovation_number){
    //                 total_w_diff = Math.abs(a_connections[a_index].weight - b_connections[b_index].weight);
    //                 a_index++;
    //                 b_index++;
    //                 same_connections_number++;
    //             }
    //             else if(a_connections[a_index].innovation_number < b_connections[b_index].innovation_number){
    //                 disjoint++;
    //                 if(a_index !== a_connection_len){
    //                     a_index++;
    //                 }
    //             }
    //             else if(a_connections[a_index].innovation_number > b_connections[b_index].innovation_number){
    //                 if(b_index === b_connection_len){
    //                     excess++;
    //                 }
    //                 else{
    //                     disjoint++;
    //                     b_index++;
    //                 }
    //             }
    //         }
    //         else{
    //             if(a_index === a_connection_len && b_index === b_connection_len){
    //             // console.log('hello break')
    //                 break;
    //             }
    //             else if(a_index === a_connection_len){
    //                 excess++;
    //                 b_index++;
    //             }
    //             else if(b_index === b_connection_len){
    //                 disjoint++;
    //                 a_index++;
    //             }
    //         }
    //         // console.log(a_index, a_connection_len, 'noooooo');
    //         // console.log(b_index, b_connection_len, 'nbnbnbnbnbnbn');
    //     }
    //     let N = 1;
    //     if(a_connection_len >= 20 || b_connection_len >= 20){
    //         if(a_connection_len >= b_connection_len){
    //             N = a_connection_len;
    //         }
    //         else{
    //             N = b_connection_len;
    //         }
    //     }
    //     // console.log(N);
    //     // console.log(disjoint)
    //     // console.log(excess)
    //     // console.log(total_w_diff)
    //     // console.log(same_connections_number);
    //     let distance = ((this.c1 * excess) / N) + ((this.c2 * disjoint) / N) + (this.c3 * (total_w_diff / same_connections_number));
    //     // console.log(distance);
    //     // console.log(this.mating_pool)
    //     // console.log(this.global_connections_list)
    //     // console.log(this.global_mutation)
    //     // console.log(this.species)
    //     return distance;
    // };
    this.generateSpecies = function(){
        let species = [];
        for(let bird of this.population){
            if(species.length < 1){
                let first_species = new Species();
                first_species.init(bird);
                species.push(first_species);
            }
            else{
                // console.log('its happening');
                let shortest_index = 0,
                shortest_distance = this.getDistance(species[shortest_index].represent_bird.brain, bird.brain);
                // console.log('whut')
                for(let i=0; i<species.length; i++){
                    // console.log(species[i].represent_bird === bird)
                    let distance = this.getDistance(species[i].represent_bird.brain, bird.brain);
                    // console.log(distance);
                    if(distance < shortest_distance){
                        shortest_distance = distance;
                        shortest_index = i;
                        // console.log('i lik 1')
                    }
                }
                // console.log('Showing shortest');
                // console.log(shortest_index, shortest_distance);
                if(shortest_distance > this.compatibility_threshold){
                    let new_spec = new Species();
                    new_spec.init(bird);
                    species.push(new_spec);
                    // console.log('i lik 2')
                }
                else{
                    species[shortest_index].addGenome(bird);
                    // console.log('i lik 3')
                }
                // console.log('Boop \n');
            }
            // console.log(species);
        }
        // console.log(species);
        this.species = species;
    };
    this.sortSpeciesByFitness = function(species){
        species.all_birds.sort((bird_a, bird_b) => {
            return bird_b.game_score - bird_a.game_score;
        });
        return species;
    }
    this.prunePopulation = function(){
        let species = this.species;
        for(let i=0; i<species.length; i++){
            species[i] = this.sortSpeciesByFitness(species[i]);
            let num_remove_from_spec = Math.floor(species[i].all_birds.length * this.prune_percentage) + 1;
            let spec_ori_pop = species[i].all_birds.length;
            for(let j=spec_ori_pop-1; j>=spec_ori_pop - 1 - num_remove_from_spec; j--){
                species[i].all_birds.splice(i, 1);
            }
        }
        // console.log(species);
        console.log(this.species);
        console.log(this.population)
    };
    this.setAdjustedScores = function(){
        for(let i=0; i<this.species.length; i++){
            for(let j=0; j<this.species[i].all_birds.length; j++){
                this.species[i].all_birds[j].setAdjustedScore(this.species[i].all_birds[j].game_score / this.species[i].all_birds.length);
            }
        }
    };
    this.generateMatingPool = function(){
        let new_pop = [];
        let mating_pool = [];
        for(let spec of this.species){
            new_pop = new_pop.concat(spec.all_birds);
        }
        let max_score = 0;
        for(let bird of new_pop){
            if(bird.adjusted_score > max_score){
                max_score = bird.adjusted_score;
            }
        }
        for(let bird of new_pop){
            let mapped_score = map(bird.adjusted_score, 0, max_score, 0, 100);
            for(let j=0; j<mapped_score; j++){
                mating_pool.push(bird);
            }
        }
        this.mating_pool = mating_pool;
    };
    this.mutateSecondAddNode = function(child_bird, first_mutate_nodes_list){
        if(this.global_mutation.length < 1){
            let new_node = new Node();
            new_node.init(this.global_node_number, 'hidden', first_mutate_nodes_list[0].smaller_layer + 1);
            // back connection weight is 1
            let back_connection = this.generateConnection(first_mutate_nodes_list[0].connection.in_node, this.global_node_number);
            let front_connection = this.generateConnection(this.global_node_number, first_mutate_nodes_list[0].connection.out_node);
            back_connection.setWeight(1);
            front_connection.setWeight(first_mutate_nodes_list[0].connection.weight);
            let return_connections = [back_connection, front_connection];
            let add_mutate_obj = {
                connection: first_mutate_nodes_list[0].connection,
                smaller_layer: first_mutate_nodes_list[0].smaller_layer,
                return_connections: return_connections,
                new_node: new_node,
            };
            this.global_mutation.push(add_mutate_obj);
            this.global_connections_list.push(back_connection);
            this.global_connections_list.push(front_connection);
            this.global_node_number++;
            // console.log('First mutation')
            this.mutateSecondAddNode(child_bird, first_mutate_nodes_list);
            // console.log(add_mutate_obj);
        }
        else{
            let final_add_connections = [],
            final_add_nodes = [];
            for(let first_mutate_node of first_mutate_nodes_list){
                let is_new = true;
                let not_new_obj = null;
                // console.log(first_mutate_node);
                for(let global_mutate_obj of this.global_mutation){
                    // console.log(global_mutate_obj);
                    if(global_mutate_obj.connection.in_node === first_mutate_node.connection.in_node && global_mutate_obj.connection.out_node === first_mutate_node.connection.out_node){
                        is_new = false;
                        not_new_obj = global_mutate_obj;
                    }
                }
                if(is_new){
                    let new_node = new Node();
                    new_node.init(this.global_node_number, 'hidden', first_mutate_node.smaller_layer + 1);
                    let back_connection = this.generateConnection(first_mutate_node.connection.in_node, this.global_node_number);
                    let front_connection = this.generateConnection(this.global_node_number, first_mutate_node.connection.out_node);
                    back_connection.setWeight(1);
                    front_connection.setWeight(first_mutate_node.connection.weight);
                    let return_connections = [back_connection, front_connection];
                    let add_mutate_obj = {
                        connection: first_mutate_node.connection,
                        smaller_layer: first_mutate_node.smaller_layer,
                        return_connections: return_connections,
                        new_node: new_node,
                    };
                    final_add_connections.push(back_connection.copy());
                    final_add_connections.push(front_connection.copy());
                    final_add_nodes.push(new_node.copy());
                    this.global_mutation.push(add_mutate_obj);
                    this.global_connections_list.push(back_connection);
                    this.global_connections_list.push(front_connection);
                    this.global_node_number++;
                }
                else{
                    let return_connections = not_new_obj.return_connections;
                    let back_connection = return_connections[0],
                    front_connection = return_connections[1];
                    front_connection.setWeight(first_mutate_node.connection.weight);
                    final_add_connections.push(back_connection.copy());
                    final_add_connections.push(front_connection.copy());
                    final_add_nodes.push(not_new_obj.new_node.copy());
                }
            }
            // console.log(final_add_connections);
            // console.log(final_add_nodes);
            // console.log(this.global_connections_list);
            // console.log(this.global_mutation);
            child_bird.mutateSecondAddNode(final_add_connections, final_add_nodes);
        }
    };
    this.mutateSecondAddConnection = function(child_bird, first_mutate_connection_list){
        let final_add_connections = [];
        for(let connection of first_mutate_connection_list){
            let new_connection = this.generateConnection(connection.in_node, connection.out_node);
            final_add_connections.push(new_connection.copy());
        }
        child_bird.mutateSecondAddConnection(final_add_connections);
    };
    this.mutateBird = function(child_bird){
        // let first_mutate_nodes_list = child_bird.mutateFirstAddNode();
        // if(first_mutate_nodes_list !== null){
        //     this.mutateSecondAddNode(child_bird, first_mutate_nodes_list);
        // }
        // let first_mutate_connection_list = child_bird.mutateFirstAddConnection();
        // if(first_mutate_connection_list !== null){
        //     this.mutateSecondAddConnection(child_bird, first_mutate_connection_list);
        //     // console.log(first_mutate_connection_list);
        // }
        child_bird.mutateRest();

    };
    this.generateOffspring = function(){
        let new_population = [];
        for(let i=0; i<this.total_pop; i++){
            let bird_a = this.mating_pool[Math.floor(Math.random() * this.mating_pool.length)],
            bird_b = this.mating_pool[Math.floor(Math.random() * this.mating_pool.length)];
            let child_bird = bird_a.crossover(bird_b);
            this.mutateBird(child_bird);
            new_population.push(child_bird);
        }
        this.population = new_population;
        console.log('Generation:', this.generation);
        console.log(this.global_connections_list);
        console.log(this.global_connections_list);
        console.log(this.species);
        console.log(this.mating_pool);
        // debugger;
        this.generation++
        // let a = this.population[0].crossover(this.population[1]);
        // console.log(a);
    };
    // this.firstGen = function(input_nodes, output_nodes){
    //     let starting_node_list = []
    //     let input_nodes_list = [],
    //     output_nodes_list = [];
    //     // Getting the input nodes
    //     for(let i=0; i<input_nodes; i++){
    //         let node = new Node();
    //         node.init(i+1, 'input', 0);
    //         starting_node_list.push(node);
    //         input_nodes_list.push(node);
    //     }
    //     // Getting the output nodes
    //     for(let i=0; i<output_nodes; i++){
    //         let node = new Node();
    //         let node_number = input_nodes + i + 1;
    //         node.init(node_number, 'output', -1);
    //         starting_node_list.push(node);
    //         output_nodes_list.push(node);
    //     }
    //     let starting_connection_list = [];
    //     // Generating the connection for the first generation
    //     // Goes taking one input and getting the connection to all outputs
    //     // We are assuming that all of these connection are unique
    //     // Thus the global innovation number increase for each connection
    //     // for(let i=0; i<input_nodes_list.length; i++){
    //     //     let input_node = input_nodes_list[i];
    //     //     for(let j=0; j<output_nodes_list.length; j++){
    //     //         let output_node = output_nodes_list[j];
    //     //         let connection = new Connection();
    //     //         let weight = (Math.random() * 4) - 2;
    //     //         console.log(weight);
    //     //         connection.init(input_node.node_number, output_node.node_number, weight, true);
    //     //         connection.setInnovationNumber(this.global_innovation_number);
    //     //         this.global_innovation_number++;
    //     //         starting_connection_list.push(connection);
    //     //         this.global_connections_list.push(connection);
    //     //     }
    //     // }
    //     // this.global_connections_list.push(starting_connection_list);

    //     let population = [];
    //     for(let i=0; i<this.total_pop; i++){
    //         gravity = 0.6;
    //         lift = -20;
    //         air_res = 0.9;
    //         let starting_connection_list = this.whatFunc(input_nodes_list, output_nodes_list, input_nodes_list);
    //         let bird = new Bird(gravity, lift, air_res);
    //         bird.generateBrain(true, {
    //             mutation_rate: this.mutation_rate,
    //             nodes_list: starting_node_list,
    //             connections_list: starting_connection_list,
    //         });
    //         population.push(bird);
    //         // let genome = new Genome();
    //         // genome.init(this.mutation_rate, starting_node_list, starting_connection_list);
    //         // population.push(genome);
    //     }
    //     this.population = population;
    // }

}