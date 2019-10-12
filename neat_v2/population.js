function Population(){
    this.init = function(total_pop, mutation_rate){
        this.total_pop = total_pop;
        this.mutation_rate = mutation_rate;
        this.global_innovation_number = 1;
        this.global_connections_list = [];
        this.population = [];
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
        }
        // Getting the output nodes
        for(let i=0; i<output_nodes; i++){
            let node = new Node();
            let node_number = input_nodes + i + 1;
            node.init(node_number, 'output', -1);
            output_nodes_list.push(node);
            starting_nodes_list.push(node);
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
                if(connection.in_node === in_node && connection.out_node === connection.out_node){
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