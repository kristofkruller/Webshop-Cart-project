// selectors 
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
//cart empty array
let cart = [];
//buttons empty array 
let buttonsDOM = [];
// getting the products 
class Products{
    async getProducts(){
        try {
        let result = await fetch('products.json');
        let data = await result.json();
        //object properties restucture
        let products = data.items;
        products = products.map(item =>{
            const {title,price} = item.fields;
            const {id} = item.sys;
            const image = item.fields.image.fields.file.url;
            return {title, price, id, image}
        })
        return products
        //restucture end
        } catch (error) {
            console.log(error);
        }
    }
}
// display products
class UI {
    displayProducts(products){
        let result = '';
        products.forEach(product => {
            result += `
            <aricle class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product"
                    class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </aricle>
            `;    
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.innerText = "In Cart"
                button.disabled = true;
            } 
                button.addEventListener('click', event => {
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    // get product from products by id. amount for counter. {...}spread operator 
                    // to get all the props    
                    let cartItem = { ...Storage.getProducts(id), amount: 1 };
                    // add it to the empty cart array what made in the beginning
                    cart = [...cart, cartItem];
                    // save to LocalStorage 
                    Storage.saveCart(cart);
                    // set cart values see the method below this
                    this.setCartValues(cart);
                    // display cart item see the method below this
                    this.addCartItem(cartItem);
                    // show cart see the method below this
                    this.showCart();
                });
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    // add cart item dinamically
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image}
        alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
        `;
        cartContent.appendChild(div);
    }
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart);
    }
    populateCart(cart){
        cart.forEach(item =>this.addCartItem(item));
    }
    cartLogic() {
        // clear cart btn
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
        // functionality
        
        // cart click events with events bubbling
        cartContent.addEventListener('click', event => {
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;    
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement); 
                    this.removeItem(id);
                }                
            }
        });
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    static getProducts(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(card){
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    // setup app
    ui.setupAPP();

    // get all products
    products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });
});

/* Project process line --------------------------------
- First set up: selectors then determine the 
classes (Products UI and Storage as empty-body classes) and let cart an empty array, 
for last move e listener for DOMcontent  establish class callers. 
-- get Products session, fetch establising, async await (instead of old .then because i dont need a sequence) for fetch JSON, 
after we get back the data with the result itself and put it into json(); 
Wrap in Try - and put Catch in the end - added for error trap.
-- originally the json content was set up to match with Contentful
(https://www.contentful.com/). I did not wanted to use that way so next 
//object properties restucture field established. Using map() method every item 
will be a new object (in the array), when map is on destructuring out elements from "field" property, so we have 
title,price id image so its more clean. in the return we give back the clean object. 
out of map(){} return again, but there the products itself to let them be created. 

- At UI Class I want to display products next. let result empty string. forEach for the argument. 
return+= will add for result variable instead of overwriting it. With backticks import the 
HTML product element to the function body. Swap its elements to dynamic ${} attributes.
Right after the forEach session access the variable what holds originally the HTML element and
refer back the result method.
-- For Buttons, function create. Inside do a selection (this [...selector] is a nice way to get instantly array, not 
Nodelist for selection, so I dont need to transorm it separately).  
Next set up a forEach callback. Inside ceate variables. find() method used for id match. 
If(){} else(){} for the button behaviour. 
event.target set to disabled after clicked and text in cart. 
Rest of the functions inside this one are //commented directly. Structure of Storage follows the sequence of UI elements.
-- the counter can be found in this Class as well. setCartValue works with map(){}.
Just give back the value after the countings with innerText and must be parsed to let it be a number.
-- addCartItem adds a div with classList to HTML with dynamic ${} elements. 
As closure must be appended to parent to declare position within the DOM. 
-- Show and hide cart are simple class adding / removing methods.
-- setupAPP:

- Storage class will contain static methods, then I can reuse them in the UI Class. 
for setItem the data must be stringified because storage can not store them as an Array.
--Next JSON parse to get items from the local storage. find() return product if the id matches. 
--saveCart JSON stringify again
--getCart can be done with if - else, or with ? : operators. If you have value already in the cart,
itt will parse local storage. If empty then we get empty array. 



*/