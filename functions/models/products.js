class Products {
  constructor(name, description, price, quantity, status, idCompany, company_name) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.status = status;
    this.idCompany = idCompany;
    this.company_name = company_name;
  }
}

module.exports = {
  Products,
};
