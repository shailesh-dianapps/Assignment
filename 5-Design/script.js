let total = 0;
let wishlist = new Set();

function addToList(price, productCode, buttonElement){
    if(wishlist.has(productCode)){
        alert("This product is already in your wishlist.");
        return;
    }
        
    wishlist.add(productCode);
    total += price;
    document.getElementById("wishlist-total").innerText = total;
    buttonElement.innerText = "Remove from list";
    buttonElement.onclick = () => removeFromList(price, productCode, buttonElement);
}

function removeFromList(price, productCode, buttonElement){
    if(!wishlist.has(productCode)) return;
    wishlist.delete(productCode);
    total -= price;
    document.getElementById("wishlist-total").innerText = total;
    buttonElement.innerText = "Add to list";
    buttonElement.onclick = () => addToList(price, productCode, buttonElement);
}
