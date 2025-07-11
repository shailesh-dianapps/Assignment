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

    const card = buttonElement.parentElement;
    const name = card.querySelector("h3").innerText;
    const priceText = card.querySelector(".price").innerText;
    const oldPriceEl = card.querySelector(".old-price");
    const oldPrice = oldPriceEl ? parseInt(oldPriceEl.innerText.replace("SEK", "").trim()) : null;
    const saved = oldPrice ? oldPrice - price : 0;

    const item = document.createElement("li");
    item.id = `item-${productCode}`;
    item.innerHTML = `
        <strong>${name}</strong> - SEK ${price} ${saved ? `(Saved SEK ${saved})` : ""}
        <button onclick="removeFromList(${price}, '${productCode}')">Remove</button>
    `;
    document.getElementById("wishlist-items").appendChild(item);
}

function removeFromList(price, productCode){
    if(!wishlist.has(productCode)) return;

    wishlist.delete(productCode);
    total -= price;
    document.getElementById("wishlist-total").innerText = total;

    const itemElement = document.getElementById(`item-${productCode}`);
    if(itemElement) itemElement.remove();
}
