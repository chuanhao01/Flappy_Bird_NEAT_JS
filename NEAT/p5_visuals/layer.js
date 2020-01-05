function Layer(){
    this.init = function(layer_number){
        this.layer_number = layer_number;
        this.nodes = [];
    };
    this.addNode = function(node){
        this.nodes.push(node);
    };
}