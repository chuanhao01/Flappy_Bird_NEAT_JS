function Genome(){
    this.init = function(nodes_list, connections_list){
        this.nodes_list = nodes_list;
        this.connections_list = connections_list;
        this.real_connection_list = [];
        this.sortConnections();
    };
    this.sortConnections = function(){
        this.connections_list.sort((connection_a, connection_b) => {
            return connection_a.innovation_number - connection_b.innovation_number
        });
    };
    this.feedForward = function(inputs){
        // Setting the inputs into the input nodes
        for(let i=0; i<inputs.length; i++){
            this.nodes_list[i].input_sum = inputs[i];
        }
        let nodes_needed = this.connectNodes();
        let max_layer = this.getMaxLayer(nodes_needed);
        for(let layer_number = 0; layer_number<=max_layer; layer_number++){
            let curr_layer = [];
            for(let node of nodes_needed){
                if(node.layer_number === layer_number){
                    curr_layer.push(node);
                }
            }
            console.log(curr_layer)
        }
        // console.log(max_layer);
        // console.log(nodes_needed);

    };
    this.getMaxLayer = function(nodes_list){
        let max_layer = 0;
        for(let node of nodes_list){
            if(node.layer_number > max_layer){
                max_layer = node.layer_number;
            }
        }
        return max_layer;
    };
    this.makeRealConnection = function(){
        
    };
    this.connectNodes = function(){
        let nodes_needed = [];
        for(let connection of this.connections_list){
            if(connection.enabled){
                let in_node = this.nodes_list[connection.in_node - 1],
                out_node = this.nodes_list[connection.out_node - 1];
                in_node.output_connections.push(connection.clone());
                // Checking if the node is already in the list
                // If not add it to the list
                // NOTE: This is by reference
                if(nodes_needed.length < 1){
                    nodes_needed.push(in_node);
                    nodes_needed.push(out_node);
                }
                else{
                    let add_in = true,
                    add_out = true;
                    for(let node of nodes_needed){
                        if(node.node_number === in_node.node_number){
                            add_in = false;
                        }
                        if(node.node_number === out_node.node_number){
                            add_out = false;
                        }
                    }
                    if(add_in){
                        nodes_needed.push(in_node);
                    }
                    if(add_out){
                        nodes_needed.push(out_node);
                    }
                }
            }
        }
        return nodes_needed;
        // for(let node of this.nodes_list){
        //     for(let connection of this.connections_list){
        //         if(connection.enabled){
        //             if(connection.in_node === node.node_number){
        //                 node.output_connections.push(connection.clone());
        //             }
        //         }
        //     }
        // }
    };
}