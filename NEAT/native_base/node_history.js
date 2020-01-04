// Just an object to store the data of a node before creation
function NodeHistory(){
    this.init = function(node_number, type, layer_number){
        this.node_number = node_number;
        this.type = type;
        this.layer_number = layer_number;
    };
    this.clone = function(){
        let new_node_history = new NodeHistory();
        new_node_history.init(this.node_number, this.type, this.layer_number);
        return new_node_history;
    };
    this.load = function(model){
        this.node_number = model.node_number;
        this.type = model.type;
        this.layer_number = model.layer_number;
    };
}
