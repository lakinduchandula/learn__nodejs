const getDb = require('../utils/database').getDb;

class Product {
  constructor(title, price, description, imageUrl){
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save(){
    
  }
}