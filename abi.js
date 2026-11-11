const products = [
    {id:1, name:"Classic Cotton Shirt", category:"Men", price:1299, icon:"👔", sizes:["S","M","L","XL"]},
    {id:2, name:"Slim-Fit Denim Jeans", category:"Men", price:1799, icon:"👖", sizes:["30","32","34","36"]},
    {id:3, name:"Polo T-Shirt", category:"Men", price:899, icon:"👕", sizes:["S","M","L","XL"]},
    {id:4, name:"Chino Trousers", category:"Men", price:1499, icon:"👖", sizes:["30","32","34","36"]},
    {id:5, name:"Linen Shirt", category:"Men", price:1599, icon:"👔", sizes:["S","M","L","XL"]},
    {id:6, name:"Graphic T-Shirt", category:"Men", price:699, icon:"👕", sizes:["S","M","L","XL"]},
    {id:7, name:"Floral Summer Dress", category:"Women", price:1999, icon:"👗", sizes:["S","M","L"]},
    {id:8, name:"Cotton Kurti", category:"Women", price:1199, icon:"🥻", sizes:["S","M","L","XL"]},
    {id:9, name:"High-Waist Jeans", category:"Women", price:1699, icon:"👖", sizes:["28","30","32","34"]},
    {id:10, name:"Casual Top", category:"Women", price:899, icon:"👚", sizes:["S","M","L"]},
    {id:11, name:"Maxi Skirt", category:"Women", price:1399, icon:"👗", sizes:["S","M","L"]},
    {id:12, name:"Evening Gown", category:"Women", price:2999, icon:"👗", sizes:["S","M","L"]},
    {id:13, name:"Printed T-Shirt Set", category:"Kids", price:799, icon:"🧒", sizes:["2-4 yrs","5-7 yrs","8-10 yrs"]},
    {id:14, name:"Denim Dungarees", category:"Kids", price:999, icon:"👖", sizes:["3-5 yrs","6-8 yrs"]},
    {id:15, name:"Party Frock", category:"Kids", price:1299, icon:"👗", sizes:["3-5 yrs","6-8 yrs"]},
    {id:16, name:"Cotton Shorts", category:"Kids", price:499, icon:"🩳", sizes:["2-4 yrs","5-7 yrs"]},
    {id:17, name:"Hooded Sweatshirt", category:"Kids", price:1099, icon:"🧥", sizes:["4-6 yrs","7-9 yrs"]},
    {id:18, name:"School Polo", category:"Kids", price:599, icon:"👕", sizes:["5-7 yrs","8-10 yrs"]},
    {id:19, name:"Leather Belt", category:"Accessories", price:599, icon:"🧷", sizes:["S","M","L"]},
    {id:20, name:"Canvas Tote Bag", category:"Accessories", price:799, icon:"👜", sizes:["One size"]},
    {id:21, name:"Travel Backpack", category:"Accessories", price:1499, icon:"🎒", sizes:["One size"]},
    {id:22, name:"Mini Sling Bag", category:"Accessories", price:999, icon:"👜", sizes:["One size"]}
];
let activeFilter = "All";
let searchTerm = "";
let cart = JSON.parse(
    localStorage.getItem("urbanthread_cart") || "[]"
);
const money = n => "₹" + n.toLocaleString("en-IN");
const saveCart = () => {
    localStorage.setItem(
        "urbanthread_cart",
        JSON.stringify(cart)
    );
};
function showNotice(message) {
    const notice = document.getElementById("notice");
    notice.textContent = message;
    notice.classList.add("show");
    setTimeout(() => {
        notice.classList.remove("show");
    }, 1800);
}
function renderProducts() {
    const filtered = products.filter(p =>
        (activeFilter === "All" || p.category === activeFilter) &&
        (
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        )
    );
    document.getElementById("resultCount").textContent =
        `${filtered.length} products`;
    document.getElementById("productGrid").innerHTML =
        filtered.length ?
        filtered.map(p => `
            <article class="card">
                <div class="product-art">
                    ${p.icon}
                </div>
                <div class="card-body">
                    <div class="tag">
                        ${p.category}
                    </div>
                    <h3>${p.name}</h3>
                    <div class="options">
                        <label for="size-${p.id}">
                            Size
                        </label>
                        <select id="size-${p.id}">
                            ${p.sizes.map(s => `<option>${s}</option>`).join("")}
                        </select>
                    </div>
                    <div class="price">
                        ${money(p.price)}
                    </div>
                    <button class="btn" onclick="addToCart(${p.id})">
                        Add to Cart
                    </button>
                </div>
            </article>
        `).join("")
        :
        '<p class="empty">No products found. Try another search.</p>';
}
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const size = document.getElementById(`size-${id}`).value;
    const existing = cart.find(
        item => item.id === id && item.size === size
    );
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id,
            name: product.name,
            price: product.price,
            size,
            quantity: 1
        });
    }
    saveCart();
    renderCart();
    showNotice(`${product.name} added to your cart.`);
}
function changeQuantity(id, size, delta) {
    const item = cart.find(
        i => i.id === id && i.size === size
    );
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(
            i => !(i.id === id && i.size === size)
        );
    }
    saveCart();
    renderCart();
}
function removeItem(id, size) {
    cart = cart.filter(
        i => !(i.id === id && i.size === size)
    );
    saveCart();
    renderCart();
}
function renderCart() {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    document.getElementById("cartCount").textContent = count;
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const panel = document.getElementById("cartPanel");
    if (!cart.length) {
        panel.innerHTML =
            '<p class="lead">Your cart is empty. Add products from our collection.</p>';
        return;
    }
    panel.innerHTML = cart.map(item => `
        <div class="cart-row">
            <div>
                <strong>${item.name}</strong>
                <br>
                <small>Size: ${item.size}</small>
            </div>
            <div>
                ${money(item.price)}
            </div>
            <div>
                <button class="filter"
                    onclick="changeQuantity(${item.id},'${item.size}',-1)">
                    −
                </button>
                <strong>${item.quantity}</strong>
                <button class="filter"
                    onclick="changeQuantity(${item.id},'${item.size}',1)">
                    +
                </button>
            </div>
            <button class="remove"
                onclick="removeItem(${item.id},'${item.size}')">
                Remove
            </button>
        </div>
    `).join("") +
    `
        <div class="cart-total">
            <span>Total</span>
            <span>${money(total)}</span>
        </div>
        <p style="text-align:right">
            <button class="btn" onclick="checkout()">
                Proceed to Checkout
            </button>
        </p>
    `;
}
function checkout() {
    showNotice(
        "Demo store: checkout is not connected to a payment service."
    );
}
document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach(b => {
            b.classList.toggle(
                "active",
                b === button
            );
        });
        renderProducts();
    });
});
document.querySelectorAll("[data-filter-link]").forEach(link => {
    link.addEventListener("click", () => {
        activeFilter = link.dataset.filterLink;
        document.querySelectorAll("[data-filter]").forEach(b => {
            b.classList.toggle(
                "active",
                b.dataset.filter === activeFilter
            );
        });
        renderProducts();
    });
});
document.getElementById("searchForm").addEventListener(
    "submit",
    event => {
        event.preventDefault();
        searchTerm = document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();
        renderProducts();
        document.getElementById("products").scrollIntoView();
    }
);
document.getElementById("contactForm").addEventListener(
    "submit",
    event => {
        event.preventDefault();
        showNotice(
            "Thank you! Your message has been received in this demo."
        );
        event.target.reset();
    }
);
renderProducts();
renderCart();