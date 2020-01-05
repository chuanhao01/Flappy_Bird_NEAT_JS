function NEAT_VISUAL(){
    this.init = function(player, top_left){
        this.player = player;
        /*
        top_left current_pos is an object of
        {
            'x': float,
            'y': float
        }
        */
        this.top_left = top_left;
        this.starting_pos = {
            'y': top_left.y + 25,
            'x': top_left.x + 25
        };
    };
    // Main functions
    this.getModelVisual = function(){
        // Define and init data
        let matrix_data = [];
        // Get data from player
        let nodes_needed = this.player.brain.nodes_genes_needed,
        connections = this.player.brain.connections_history_list;
        let max_layer = this.player.brain.getMaxLayer();
        // Getting the layers needed
        let layers = this.getLayers(nodes_needed, max_layer);
        // Getting the connnection needed
        let connections_needed = this.getEnabledConnections(connections);
        // Generate the matrix here
        matrix_data = this.genMatrixData(layers);
        // Draw the matrix
        this.drawMatrix(matrix_data);
        // Drawing connections
        this.drawConnections(matrix_data, connections_needed);

        // console.table(matrix_data);
        // let sum = 0;
        // for(let layer of layers){
        //     sum += layer.nodes.length;
        // }
        // console.log(`sum: ${sum}`);
        // console.log(nodes_needed);

        // console.log(connections_needed);
        // console.log(layers);
    };
    // Utility functions
    this.getLayers =  function(nodes_needed, max_layer){
        let layers = [];
        for(let i=0; i<=max_layer; i++){
            for(let node of nodes_needed){
                if(node.layer_number === i){
                    // If the node is in the current layer
                    if(layers.length === 0){
                        // If there are no layers yet, init one
                        let layer = new Layer();
                        layer.init(i);
                        layer.addNode(node);
                        layers.push(layer);
                    }
                    else{
                        // If there are already layers made
                        let new_layer = true; 
                        for(let layer of layers){
                            if(layer.layer_number === node.layer_number){
                                // If it belongs to an existsing layer
                                new_layer = false;
                                layer.addNode(node);
                            }
                        }
                        if(new_layer){
                            // If a new layer is needed
                            let layer = new Layer();
                            layer.init(node.layer_number);
                            layer.addNode(node);
                            layers.push(layer);
                        }
                    }
                }
            }
        }
        // Get the last layer
        for(let i=-1; i<0; i++){
            for(let node of nodes_needed){
                if(node.layer_number === i){
                    // If the node is in the current layer
                    if(layers.length === 0){
                        // If there are no layers yet, init one
                        let layer = new Layer();
                        layer.init(i);
                        layer.addNode(node);
                        layers.push(layer);
                    }
                    else{
                        // If there are already layers made
                        let new_layer = true; 
                        for(let layer of layers){
                            if(layer.layer_number === node.layer_number){
                                // If it belongs to an existsing layer
                                new_layer = false;
                                layer.addNode(node);
                            }
                        }
                        if(new_layer){
                            // If a new layer is needed
                            let layer = new Layer();
                            layer.init(node.layer_number);
                            layer.addNode(node);
                            layers.push(layer);
                        }
                    }
                }
            }
        }
        return layers;
    };
    this.getEnabledConnections = function(connections){
        let enabled_connections = [];
        for(let connection of connections){
            if(connection.enabled){
                enabled_connections.push(connection);
            }
        }
        return enabled_connections;
    };
    this.genMatrixData = function(layers){
        let matrix_data = [];
        let x = 0,
        y = 0;
        // Getting the y value
        // Setting y here
        for(let layer of layers){
            if(layer.nodes.length > y){
                y = layer.nodes.length;
            }
        }
        // Setting x here
        x = layers.length;
        for(let i=0; i<y; i++){
            let row = [];
            for(let j=0; j<x; j++){
                if(i < layers[j].nodes.length){
                    // If you are able to index the node here
                    row.push(layers[j].nodes[i]);
                }
                else{
                    row.push(0);
                }
            }
            matrix_data.push(row);
        }
        // Adding the outputs here

        return matrix_data;
    };
    this.drawMatrix = function(matrix_data){
        // You get it
        for(let y=0; y<matrix_data.length; y++){
            for(let x=0; x<matrix_data[y].length; x++){
                let y_pos = 60 * y + this.starting_pos.y,
                x_pos = 60 * x + this.starting_pos.x;
                if(matrix_data[y][x] !== 0){
                    fill(255);
                    circle(x_pos, y_pos, 20);
                }
            }
        }
    };
    this.drawConnections = function(matrix_data, connections){
        for(let connection of connections){
            // For each connection
            let in_pos = this.findNode(matrix_data, connection.in_node),
            out_pos = this.findNode(matrix_data, connection.out_node);
            in_pos = this.mapMatrixDraw(in_pos);
            out_pos = this.mapMatrixDraw(out_pos);
            this.drawConnection(in_pos, out_pos);
        }
    };
    this.findNode = function(matrix_data, node_number){
        for(let y=0; y<matrix_data.length; y++){
            for(let x=0; x<matrix_data[y].length; x++){
                if(matrix_data[y][x] !== 0){
                    // If there is a node here
                    let node = matrix_data[y][x];
                    if(node.node_number === node_number){
                        return [y, x];
                    }
                }
            }
        }
    };
    this.drawConnection = function(in_pos, out_pos){
        stroke(255);
        strokeWeight(2);
        line(in_pos[1], in_pos[0], out_pos[1], out_pos[0]);
    };
    this.mapMatrixDraw = function(matrix_form){
        let map_y = matrix_form[0] * 60 + this.starting_pos.y,
        map_x = matrix_form[1] * 60 + this.starting_pos.x;
        return [map_y, map_x];
    };
}