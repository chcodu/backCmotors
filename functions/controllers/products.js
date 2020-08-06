const config = require("./config");
const { GenericResponse } = require("../modelRequest/GenericResponse");
const { Products } = require("../models/products");
const { ProductsRequest } = require("../modelRequest/products");

var db = config.db;

const saveProduct = async (req, res) => {
  const params = req.body;
  const product = new Products(
    params.name,
    params.description,
    params.price,
    params.quantity,
    params.status,
    params.idCompany,
    params.idCompany + params.name
  );  
  var GResponse = new GenericResponse();

  if (
    product.name &&
    product.description &&
    product.price &&
    product.quantity &&
    product.status &&
    product.idCompany
  ) {
    var existProduct = await db
      .ref("product")
      .orderByChild("company_name")
      .equalTo(product.company_name)
      .once("value", (snapshot) => {
        return snapshot;
      })
      .catch((err) => {
        return err;
      });

    if (existProduct.val() !== null) {
      return res.status(200).send({
        status: 200,
        message: "This product name has already been registered",
        isSuccessFul: false,
        data: null,
      });
    }

    var keyColletion = await db
      .ref("product")
      .push(product)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    if (keyColletion.getKey() === null) {
      return res.status(404).send({
        status: 404,
        message: "Error was ocurred",
        isSuccessFul: false,
        data: null,
      });
    }

    const newProduct = await db
      .ref("product")
      .child(keyColletion.getKey())
      .once("value", (response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    if (newProduct.val().name !== null) {
      var productResponse = new ProductsRequest(
        keyColletion.getKey(),
        newProduct.val().name,
        newProduct.val().description,
        newProduct.val().price,
        newProduct.val().quantity,
        newProduct.val().status,
        newProduct.val().idCompany
      );

      return res.status(200).send({
        status: 200,
        message: "Success",
        isSuccessFul: true,
        data: [productResponse],
      });
    } else {
      GResponse.status = 500;
      GResponse.message = "Error was ocurred";
      GResponse.isSuccessFul = false;
      GResponse.data = null;
      return res.status(500).send({
        GResponse,
      });
    }
  } else {
    GResponse.status = 404;
    GResponse.message = "All fields are required";
    GResponse.isSuccessFul = false;
    GResponse.data = null;
    return res.status(404).send({
      GResponse,
    });
  }
};

const getProducts = async (req, res) => {
  var GResponse = new GenericResponse();
  const params = req.body;
  const id = params.id;

  if (id) {
    var productsResponse = new Array();

    var products = await db
      .ref("product")
      .orderByChild("idCompany")
      .equalTo(id)
      .once("value", (snapshot) => {
        return snapshot;
      })
      .catch((err) => {
        return err;
      });

    if (products.val() === null) {
      GResponse.status = 404;
      GResponse.message = "Not found products";
      GResponse.isSuccessFul = false;
      GResponse.data = null;
      return res.status(404).send({
        GResponse,
      });
    }

    var product = null;
    var counter = 0;
    products.forEach((childSnapshot) => {
      var childData = childSnapshot.val();
      if (
        childData !== null &&
        childData.status === "A" &&
        parseInt(childData.quantity) > 0
      ) {
        product = new ProductsRequest(
          Object.keys(products.val())[counter],
          childData.name,
          childData.description,
          childData.price,
          childData.quantity,
          childData.status,
          childData.idCompany
        );
      }
      counter++;
      productsResponse.push(product);
    });

    if (product === null) {
      GResponse.status = 404;
      GResponse.message = "Not found products";
      GResponse.isSuccessFul = false;
      GResponse.data = null;
      return res.status(404).send({
        GResponse,
      });
    } else {
      return res.status(200).send({
        status: 200,
        message: "Success",
        isSuccessFul: true,
        data: productsResponse,
      });
    }
  } else {
    GResponse.status = 404;
    GResponse.message = "The field id is empty";
    GResponse.isSuccessFul = false;
    GResponse.data = null;
    return res.status(404).send({
      GResponse,
    });
  }
};

module.exports = {
  saveProduct,
  getProducts,
};
