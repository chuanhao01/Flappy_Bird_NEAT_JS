const NEAT_CONFIGS = {
    // Populations configurations
    total_pop: 300,
    // NEAT configurations
    mutation_rates: {
        add_node: 0.002,
        add_connection: 0.05,
        shift_weight: 0.5,
        new_weight: 0.2,
        enable_connection: 0.2 
    },
    weight_shift_coeff: 0.01,
    c1: 1,
    c2: 0.5,
    compatibility_threshold: 2.5,
    prune_percentage: 0.5,
    // Genome configs
    input_nodes: 7,
    output_nodes: 1,
};