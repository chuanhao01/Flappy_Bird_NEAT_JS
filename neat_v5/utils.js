function sigmoidActivation(x){
    let sigmoid_output = (1 / (1 + Math.exp(-x)));
    return sigmoid_output;
}