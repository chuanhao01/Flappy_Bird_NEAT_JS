function Genome(){
    this.init = function(mutation_rate, nodes_list, connections_list){
        this.mutation_rate = mutation_rate;
        this.nodes_list = nodes_list;
        this.connections_list = connections_list;
        this.sortConnections();
        this.max_layer = this.findMaxLayer();
        this.ori_score = 0;
        this.learning_rate = 0.1;
    };
    this.findMaxLayer = function(){
        let max_layer = this.nodes_list[0].layer_num;
        for(let i=1; i<this.nodes_list.length; i++){
            if(max_layer < this.nodes_list[i].layer_num){
                max_layer = this.nodes_list[i].layer_num;
            }
        }
        return max_layer;
    };
    this.connectNodes = function(){
        for(let i=0; i<this.nodes_list.length; i++){
            let node = this.nodes_list[i];
            if(node.layer_num !== -1){
                for(let j=0; j<this.connections_list.length; j++){
                    let connection = this.connections_list[j];
                    if(connection.in_node === node.node_number){
                        this.nodes_list[i].addConnection(connection);
                    }
                }
            }
        }
    };
    // Returns the index of the node number
    this.getNode = function(node_number){
        for(let i=0; i<this.nodes_list.length; i++){
            if(this.nodes_list[i].node_number === node_number){
                return i;
            }
        }
    };
    this.feedForward = function(inputs){
        for(let i=0; i<inputs.length; i++){
            this.nodes_list[i].input_sum += inputs[i];
        }
        this.connectNodes();
        for(let layer=0; layer<this.max_layer + 1; layer++){
            for(let i=0; i<this.nodes_list.length; i++){
                let node = this.nodes_list[i];
                if(node.layer_num === layer){
                    let output_obj = node.getOutput();
                    for(let output_index=0; output_index<output_obj.outputs.length; output_index++){
                        let output_node_index = this.getNode(output_obj.output_nodes[output_index]);
                        // console.log(output_obj)
                        // console.log(output_node_index);
                        // console.log(this.nodes_list)
                        this.nodes_list[output_node_index].input_sum += output_obj.outputs[output_index];
                    }
                }
            }
        }
    };
    this.clearNodes = function(){
        for(let i=0; i<this.nodes_list.length; i++){
            this.nodes_list[i].clearNode();
        }   
    };
    this.sortConnections = function(){
        this.connections_list.sort((connection_a, connection_b) => {
            return connection_a.innovation_number - connection_b.innovation_number;
        });
    };
    this.crossover = function(genome_b){
        let a_connection_index = 0,
        b_connection_index = 0;
        let a_connections = this.connections_list,
        b_connections = genome_b.connections_list;
        let a_connections_num = a_connections.length,
        b_connections_num = b_connections.length;
        let child_connections = [];
        while(true){
            if(b_connection_index < b_connections_num){
                if(a_connections[a_connection_index].innovation_number === b_connections[b_connection_index].innovation_number){
                child_connections.push(a_connections[a_connection_index]);
                a_connection_index++;
                b_connection_index++;
                }
                else if(a_connections[a_connection_index].innovation_number > b_connections[b_connection_index].innovation_number){
                    child_connections.push(b_connections[b_connection_index]);
                    b_connection_index++;
                }
                else if(a_connections[a_connection_index].innovation_number < b_connections[b_connection_index].innovation_number){
                    child_connections.push(a_connections[a_connection_index]);
                    a_connection_index++;
                }
                if(a_connection_index === a_connections_num){
                    break;
                }
            }
            else{
                child_connections.push(a_connections[a_connection_index]);
                a_connection_index++;
                if(a_connection_index === a_connections_num){
                    break;
                }
            }
        }
        let child_genome = new Genome();
        let new_nodes = [];
        for(let node of this.nodes_list){
            new_nodes.push(node.copy());
        }
        child_genome.init(this.mutation_rate, new_nodes, child_connections);
        return child_genome;
    };
    this.mutateFirstAddNode = function(){
        let mutate_nodes_list = [];
        for(let i=0; i<this.connections_list.length; i++){
            if(Math.random() < this.mutation_rate){
                let first_mutate_obj = {};
                let in_node_index = this.getNode(this.connections_list[i].in_node);
                console.log(this.connections_list);
                first_mutate_obj.smaller_layer = this.nodes_list[in_node_index].layer_num;
                first_mutate_obj.connection = this.connections_list[i].copy();
                mutate_nodes_list.push(first_mutate_obj);
                // Disable connection afterwards
                this.connections_list[i].enabled = false;
            }
        }
        if(mutate_nodes_list.length !== 0){
            return mutate_nodes_list;
        }
        else{
            return null;
        }
    };
    this.mutateSecondAddNode = function(final_add_connections, final_add_nodes){
        for(let connection of final_add_connections){
            this.connections_list.push(connection);
        }
        for(let node of final_add_nodes){
            this.nodes_list.push(node);
        }
        this.max_layer = this.findMaxLayer();
    };
    this.getNodesFromLayer = function(layer_num){
        if(layer_num > this.max_layer){
            layer_num = -1;
        }
        let nodes_numbers = [];
        for(let node of this.nodes_list){
            if(node.layer_num === layer_num){
                nodes_numbers.push(node.node_number);
            }
        }
        // console.log(nodes_numbers);
        return nodes_numbers;
    };
    this.checkConnectionValid = function(in_node, out_node){
        for(let connection of this.connections_list){
            if(connection.in_node === in_node && connection.out_node === out_node){
                return false
            }
        }
        return true;
    };
    this.mutateFirstAddConnection = function(){
        let mutate_add_connection_list = [];
        for(let i=0; i<this.nodes_list.length; i++){
            let node = this.nodes_list[i];
            if(node.layer_num !== -1){
                if(Math.random() < this.mutation_rate){
                    let next_nodes_numbers = this.getNodesFromLayer(node.layer_num + 1);
                    let selected_out_node = random(next_nodes_numbers);
                    // console.log(next_nodes_numbers);
                    // console.log(this.nodes_list);
                    // console.log(this.connections_list);
                    if(this.checkConnectionValid(node.node_number, selected_out_node)){
                        // console.log(next_nodes_numbers);
                        mutate_add_connection_list.push({
                            in_node: node.node_number,
                            out_node: selected_out_node,
                        });
                    }
                }
            }
        }
        if(mutate_add_connection_list.length < 1){
            return null;
        }
        else{
            return mutate_add_connection_list;
        }
    };
    this.mutateSecondAddConnection = function(final_add_connections){
        for(let connection of final_add_connections){
            this.connections_list.push(connection);
        }
        this.sortConnections();
        // console.log(this.connections_list);
    };
    this.mutateRest = function(){
        for(let i=0; i<this.connections_list.length; i++){
            if(this.connections_list[i].enabled){
                if(Math.random() < this.mutation_rate){
                    this.connections_list[i].weight += ((Math.random() * 4) - 2) * this.learning_rate;
                }
                if(Math.random() < this.mutation_rate){
                    this.connections_list[i].weight = ((Math.random() * 4) - 2);
                }
                if(Math.random() < this.mutation_rate){
                    this.connections_list[i].enabled = !this.connections_list[i].enabled;
                    // console.log('Weight off lel', this.connections_list[i]);
                }
            }
        }
    };
    // this.feedForward = function(inputs){
    //     for(let i=0; i<inputs.length; i++){
    //         this.nodes_list[i].input_sum = inputs[i]
    //         // this.nodes_list[i].addInput(inputs[i]);
    //     }
    //     for(let i=0; i<this.nodes_list.length; i++){
    //         let node = this.nodes_list[i];
    //         if(node.layer_num !== -1){
    //             this.addOutput(this.nodes_list[i]);
    //         }
    //     }
    //     for(let i=0; i<this.max_layer + 1; i++){
    //         let curr_layer = [];
    //         for(let j=0; j<this.nodes_list.length; j++){
    //             if(this.nodes_list[j].layer_num === i){
    //                 curr_layer.push(this.nodes_list[j]);
    //             }
    //         }
    //         for(let j=0; j<curr_layer.length; j++){
    //             let node = curr_layer[j];
    //             for(let k=0; k<node.output_nodes.length; k++){
    //                 let output_node_number = node.output_nodes[k];
    //                 let output_node_index = this.getNode(output_node_number);
    //                 let output_to_next = this.getConnection(node.node_number,output_node_number, node);
    //                 this.nodes_list[output_node_index].addInput(output_to_next);
    //             }
    //         }
    //     }
    // };
    this.getOutput = function(){
        for(let node of this.nodes_list){
            if(node.type === 'output'){
                return node.getPureOutput();
            }
        }
    };
}