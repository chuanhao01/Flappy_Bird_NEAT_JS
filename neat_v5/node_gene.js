function NodeGene(){
    this.init = function(node_number, type, layer_number){
        this.node_number = node_number;
        this.type = type;
        this.layer_number = layer_number;
        this.input_sum = 0;
        this.output_connections = [];
    };
    this.clearNode = function(){
        this.input_sum = 0;
    };
    this.feedForward = function(){
        for(let connection_gene of this.output_connections){
            let output = connection_gene.weight * this.input_sum;
            if(this.layer_number !== 0){
                output = sigmoidActivation(output);
            }
            connection_gene.out_node.input_sum += output;
        }
    };
    // Only the output nodes should be calling this func
    this.getOutput = function(){
        return sigmoidActivation(this.input_sum);
    };
}