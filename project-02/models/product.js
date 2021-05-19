const products = [];

module.exports = class Product {
    // constructor in the class
    constructor(title){
        this.title = title;
    }

    save(){ //  this method will save products
        products.push(this); // all object will push to array
    }

    // this static method can be directly call through class name(Product)
    // without instantiate object 
    static fetchAll(){ 
        return products;
    }
}