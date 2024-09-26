
function gaussianSample(mean, std){
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0*Math.log(u1)) * Math.cos(2.0*Math.PI*u2);
    return z0*std + mean;
}

function exponentialSample(lambda){
    return -Math.log(1.0 - Math.random()) / lambda;
}
