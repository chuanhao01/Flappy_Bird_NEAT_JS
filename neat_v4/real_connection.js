function RealConnection(){
    this.init = function(in_node, out_node, weight, innovation_number){
        // Nodes here are passed by reference
        this.in_node = in_node;
        this.out_node = out_node;
        this.weight = weight;
        this.innovation_number = innovation_number;
        this.enabled = true
    };
    this.clone = function(){
        let new_real_connection = new RealConnection();
        new_real_connection.init(this.in_node, this.out_node, this.weight, this.innovation_number);
        new_real_connection.enabled = this.enabled;
        return new_real_connection;
    }
}