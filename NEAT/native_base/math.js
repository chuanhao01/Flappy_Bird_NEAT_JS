// File to hold utility math function used in NEAT
function sigmoidActivation(x){
    let sigmoid_output = (1 / (1 + Math.exp(-x)));
    return sigmoid_output;
}

function randomNumber(min, max) {
    return (Math.random() * (max - min)) + min;
}

function softMax(inputs){
    let total = 0,
    outputs = [];
    for(let input of inputs){
        total += ((Math.E) ** input);
    }
    for(let i=0; i<inputs.length; i++){
        let new_value = (((Math.E) ** inputs[i]) / total);
        outputs.push(new_value);
    }
    return outputs;
}
