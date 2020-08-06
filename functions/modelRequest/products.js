class ProductsRequest {
    constructor(id, name, description, price, quantity, status, idCompany) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.price = price;
      this.quantity = quantity;
      this.status = status;
      this.idCompany = idCompany;
    }
  }
  
  module.exports = {
    ProductsRequest,
  };
  