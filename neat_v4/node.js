function Node(){
    this.init = function(node_number, type, layer_number){
        this.node_number = node_number;
        this.type = type;
        this.layer_number = layer_number;
        this.input_sum = 0;
        this.output_connections = [];
    };
    this.clone = function(){
        let new_node = new Node();
        new_node.init(this.node_number, this.type, this.layer_number);
        return new_node;    
    };
}