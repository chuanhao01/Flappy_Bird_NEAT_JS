function AddNodeMutation(){
    // curr_node_history and out_node_history are by reference to the global list
    this.init = function(original_connection_history, new_in_connection_history, new_out_connection_history){
        this.original_connection_history = original_connection_history;
        this.new_in_connection_history = new_in_connection_history;
        this.new_out_connection_history = new_out_connection_history;
    };
}