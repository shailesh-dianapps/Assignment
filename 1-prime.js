// function prime(num){
//     if(num < 2) return false;
//     for(let i=2; i<num; i++){
//         if(num % i === 0) return false;
//     }
//     return true;
// }

function prime(num){
    if(num < 2) return false;
    for(let i=2; i<=Math.sqrt(num); i++){
        if(num % i === 0) return false;
    }
    return true;
}

console.log(prime(1));
console.log(prime(3));
console.log(prime(4));
console.log(prime(7));
console.log(prime(25));