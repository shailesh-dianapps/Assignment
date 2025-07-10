function solve(arr){
    let mini = arr[0];
    let maxi = arr[0];
    for(let i=0; i<arr.length; i++){
        mini = Math.min(mini, arr[i]);
        maxi = Math.max(maxi, arr[i]);
    }

    console.log("Max: ", maxi);
    console.log("Min: ", mini);
}

solve([22,2,36,4])