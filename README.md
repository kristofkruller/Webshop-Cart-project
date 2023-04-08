# Webshop-Cart-project  
## A vanilla Javascript project. Concentrating on show-hide functionality with the cart element - data with local JSON and LocalStorage  
*Async - await, {dynamic} elements, LocalStorage = Web Storage API, Classes, innerText manipulation.*  
*Counter with `map(), parseFloat()` and `classList add - remove functions` and a lot of other `methods` but **no libraries***  

## Project process line  
- First set up: selectors then determine the classes (`Products UI and Storage as empty-body classes`) and let cart an empty array, 
for last move **event listener for DOMcontent loaded establish `class callers`**.  
- Get **Products session**, fetch establising, async await (instead of old .then because i dont need a sequence) for fetch JSON, 
after we get back the data with the result itself and put it into json();  
> - originally the json content was set up to match with (Contentful)
[https://www.contentful.com/]. I did not wanted to use that way so next object properties restucture field established. Using map() destructuring out elements from "field" property, so we have *title price id image*. In the return we give back the clean object.  

- At **UI Class** I want to display products next.  
`return +=` will add for result variable instead of overwriting it. With backticks import the `HTML` product element to the function body. Swap its elements to dynamic `${}` attributes.  
Right after the `forEach` session access the variable what holds originally the `HTML element` and refer back the result method.
> - For Buttons, function create. Inside do a selection *this [...spread] is a nice way to get instantly array, not Nodelist for selection, so I dont need to transorm it separately*.  
Next set up a `forEach callback`, create `variables`, `find()` method for id match.  
`event.target` set to disabled after clicked and text in cart.  
Rest of the functions inside this one are `//commented directly`. Structure of Storage follows the sequence of UI elements.
> - The counter can be found in this class as well. `setCartValue` works with `map()`.
Just give back the value after the countings with `innerText` and must be parsed to let it be a *number*.
> - addCartItem adds a div with `classList` to `HTML` with dynamic `${}` elements. 
As closure must be appended to parent to declare position within the *DOM*. 
> - Show and hide cart are simple class adding / removing methods.
> - setupAPP for invoke

- **Storage class** will contain static methods, then I can reuse them in the UI Class. 
For setItem the data must be `stringified` because storage can not store them as an Array.
> - Next `JSON parse` to get items from the local storage. `find()` return product if the id matches. 
> - saveCart `JSON stringify` again
> - getCart if you have value already in the cart, itt will parse local storage. If empty then we get empty array. 
