const list = document.getElementById("list");
const basketCanvas = document.getElementById("basketCanvas");
const searchResults = document.getElementById("searchResults");
const productBasketList = document.getElementById("productBasketList");
const clearButton = document.getElementById("clearButton");
const pay = document.getElementById("pay");
const fragment = document.createDocumentFragment();
const data = [
    { id: 0, name: "apple", price: 10, img: "./img/apple.jpg" },
    { id: 1, name: "pear", price: 15, img: "./img/pear.jpg" },
    { id: 2, name: "orange", price: 15, img: "./img/orange.jpg" },
    { id: 3, name: "strawbery", price: 20, img: "./img/strawberry.jpg" },
    { id: 4, name: "banana", price: 25, img: "./img/banana.jpg" },
    { id: 5, name: "mushroom", price: 25, img: "./img/mushroom.jpg" },
    { id: 6, name: "potato", price: 10, img: "./img/potato.jpg" },
    { id: 7, name: "tomato", price: 15, img: "./img/tomato.jpg" },
];
let total = document.getElementById("total");
let search = document.getElementById("search")
let searchValue

//createCard
let card;
let cardImg;
let cardBody;
let cardTitle;
let hr;
let cardPrice;
let tl;
let btn;

//addToBasket
let basketProduct;
let basketProductText;
let stock;
let reduceStockButton;
let stockSize;
let currentStock;
let increaseStockButton;
let removeStockButton;

search.addEventListener("input", () => {
    searchValue = data.filter((item) =>
        item.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
    );
    selectData(searchValue);
});

document.addEventListener("DOMContentLoaded", () => {
    selectData();
});

const selectData = (searchValue) => {
    if (searchValue == undefined) {
        createCard(data);
        searchResults.innerText = "";
    } else {
        list.innerHTML = "";
        searchResults.innerText = `${Object.keys(searchValue).length
            } products found`;
        search.value === "" && (searchResults.innerText = "");
        createCard(searchValue);
    }
};

clearButton.addEventListener("click", () => {
    productBasketList.innerHTML = "";
    document.getElementById("basketProductSize").innerText = 0;
    total.innerText = 0;
    const btn = document.querySelectorAll("#cardBtn");
    btn.forEach((e) => {
        e.disabled = false;
        e.textContent = "Add to basket";
    });
});

pay.addEventListener("click", () => {
    if (productBasketList.innerHTML == 0) {
        pay.className = "btn btn-danger w-100 text-white mb-2 invalid";
        pay.textContent = "Please add items to basket";
        setTimeout(() => {
            pay.className = "btn btn-success w-100 text-white mb-2";
            pay.textContent = "Pay";
        }, 1500);
    } else {
        const btn = document.querySelectorAll("#cardBtn");
        btn.forEach((e) => {
            e.disabled = false;
            e.textContent = "Add to basket";
        });
        document.getElementById("basketProductSize").innerText = 0;
        total.innerText = 0;
        pay.textContent = "Paid";
        const icon = document.createElement("i");
        icon.className = "bi bi-check-lg";
        pay.appendChild(icon);
        productBasketList.innerHTML = "";
        setTimeout(() => {
            icon.remove();
            pay.textContent = "Pay";
        }, 2000);
    }
});

const createCard = (data) => {
    [...data].forEach((element) => {
        card = document.createElement("div");
        card.className = "card";
        card.id = `card${element.id}`;
        card.style.width = "18rem";
        fragment.appendChild(card);

        cardImg = document.createElement("img");
        cardImg.className = "card-img-top";
        cardImg.style.objectFit = "cover";
        cardImg.style.height = "12rem";
        cardImg.src = element.img;
        card.appendChild(cardImg);

        cardBody = document.createElement("div");
        cardBody.className = "card-body";
        card.appendChild(cardBody);

        cardTitle = document.createElement("h5");
        cardTitle.className = "card-title capital-initial";
        cardTitle.textContent = element.name;
        cardBody.appendChild(cardTitle);

        hr = document.createElement("hr");
        cardTitle.appendChild(hr);

        cardPrice = document.createElement("h6");
        cardPrice.className = "card-title";
        cardPrice.textContent = element.price;
        cardPrice.style.display = "flex";
        cardPrice.style.gap = "5px";
        cardBody.appendChild(cardPrice);

        tl = document.createElement("h6");
        tl.textContent = "TL";
        cardPrice.appendChild(tl);

        btn = document.createElement("button");
        btn.className = "btn btn-outline-success w-100 text-white";
        btn.id = "cardBtn";
        btn.textContent = "Add to basket";
        btn.disabled = false;
        btn.onclick = () => {
            productToBasket(element.id);
        };
        cardBody.appendChild(btn);
    });
    list.appendChild(fragment);
};

const productToBasket = (id) => {
    addToBasket(id);
    const card = document.getElementById(`card${id}`);
    card.querySelector("#cardBtn").disabled = true;
    card.querySelector("#cardBtn").textContent = "Added to basket";
    document.getElementById("basketProductSize").innerText++;
};

const addToBasket = (cardId) => {
    total.textContent = Number(total.textContent) + Number(data[cardId].price);

    basketProduct = document.createElement("div");
    basketProduct.className =
        "bg-body-secondary m-1 p-2 rounded d-flex justify-content-between align-items-center";
    basketProduct.id = `product${cardId}`;
    fragment.appendChild(basketProduct);

    basketProductText = document.createElement("div");
    basketProductText.textContent = `${data[cardId].name} ${data[cardId].price}TL`;
    basketProductText.className = "capital-initial";
    basketProductText.style.width = "50px";
    basketProduct.appendChild(basketProductText);

    stock = document.createElement("div");
    stock.className = "d-flex gap-3 align-items-center";
    basketProduct.appendChild(stock);

    reduceStockButton = document.createElement("button");
    reduceStockButton.className =
        "btn btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center fw-bold";
    reduceStockButton.setAttribute("style", "width: 30px; height: 30px;");
    reduceStockButton.textContent = "-";
    reduceStockButton.addEventListener("click", () => {
        reduceStock(cardId);
    });
    stock.appendChild(reduceStockButton);

    stockSize = document.createElement("b");
    stockSize.textContent = 1;
    stockSize.id = "stock";
    stock.appendChild(stockSize);
    currentStock = Number(stockSize.textContent);

    increaseStockButton = document.createElement("button");
    increaseStockButton.className =
        "btn btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center fw-bold";
    increaseStockButton.setAttribute("style", "width: 30px; height: 30px;");
    increaseStockButton.textContent = "+";
    increaseStockButton.addEventListener("click", () => {
        increaseStock(cardId);
    });
    stock.appendChild(increaseStockButton);

    removeStockButton = document.createElement("button");
    removeStockButton.className = "btn-close p-2";
    removeStockButton.type = "button";
    removeStockButton.addEventListener("click", () => {
        removeStock(cardId);
    });
    basketProduct.appendChild(removeStockButton);

    productBasketList.appendChild(fragment);
};

const reduceStock = (id) => {
    const basketProduct = document.getElementById(`product${id}`);
    if (basketProduct.querySelector("#stock").innerText > 1) {
        currentStock--;
        basketProduct.querySelector("#stock").innerText--;
        total.textContent = Number(total.textContent) - Number(data[id].price);
    }
};

const increaseStock = (id) => {
    currentStock++;
    const basketProduct = document.getElementById(`product${id}`);
    basketProduct.querySelector("#stock").innerText++;
    total.textContent = Number(total.textContent) + Number(data[id].price);
};

const removeStock = (id) => {
    const basketProduct = document.getElementById(`product${id}`);
    const card = document.getElementById(`card${id}`);
    card.querySelector("#cardBtn").disabled = false;
    card.querySelector("#cardBtn").textContent = "Add to basket";
    basketProduct.remove();
    document.getElementById("basketProductSize").innerText--;
    const result =
        basketProduct.querySelector("#stock").innerText * data[id].price;
    total.textContent -= result;
};

console.log(
    "%cHello 👋",
    "font-size: 15px; color: #4CAF50; font-weight: bold; background: #FFF3E0; padding: 5px;"
);