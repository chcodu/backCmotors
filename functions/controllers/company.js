const config = require("./config");
const Company = require("../models/company");
const { GenericResponse } = require("../modelRequest/GenericResponse");
const CompanyRequest = require("../modelRequest/company");

var db = config.db;

const registerCompany = async (req, res) => {
  const params = req.body;
  const responseBody = new GenericResponse();
  const company = new Company(
    params.name,
    params.address,
    params.phone,
    params.email,
    params.lat,
    params.lon,
    params.logo,
    "A"
  );

  if (
    company.name &&
    company.address &&
    company.email &&
    company.phone &&
    company.lat &&
    company.lon
  ) {
    var existCompany = await db
      .ref("company")
      .orderByChild("name")
      .equalTo(company.name)
      .once("value", (snapshot) => {
        return snapshot;
      })
      .catch((err) => {
        return err;
      });

    if (existCompany.val() !== null) {
      return res.status(200).send({
        status: 200,
        message: "This company has already been registered",
        isSuccessFul: false,
        data: null,
      });
    }

    var keyColletion = await db
      .ref("company")
      .push(company)
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

    const newCompany = await db
      .ref("company")
      .child(keyColletion.getKey())
      .once("value", (response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    if (newCompany.val().name !== null) {
      var companyResponse = new CompanyRequest(
        keyColletion.getKey(),
        newCompany.val().name,
        newCompany.val().address,
        newCompany.val().phone,
        newCompany.val().email,
        newCompany.val().lat,
        newCompany.val().lon,
        newCompany.val().logo,
        newCompany.val().status
      );

      return res.status(200).send({
        status: 200,
        message: "Success",
        isSuccessFul: true,
        data: [companyResponse],
      });
    } else {
      return res.status(500).send({
        status: 500,
        message: "Error was ocurred",
        isSuccessFul: false,
        data: null,
      });
    }
  } else {
    responseBody.isSuccessFul = false;
    responseBody.message = "All fields are required";
    responseBody.status = 404;
    responseBody.data = null;
    return res.staus(200).send({
      responseBody,
    });
  }
};

const getCompanies = async (req, res) => {
  var responseBody = new GenericResponse();
  var params = req.body;
  const lon1 = params.lng;
  const lat1 = params.lat;

  var companies = await db
    .ref("company")
    .orderByChild("status")
    .equalTo("A")
    .once("value", (snapshot) => {
      return snapshot;
    })
    .catch((err) => {
      return err;
    });

  if (companies.val() === null) {
    responseBody.status = 404;
    responseBody.message = "Not found companies";
    responseBody.isSuccessFul = false;
    responseBody.data = null;
    return res.status(404).send({
      responseBody,
    });
  }

  var companyResponse = null;
  var companiesResponse = new Array();
  var counter = 0;
  companies.forEach((childSnapshot) => {
    var childData = childSnapshot.val();
    if (childData !== null) {
      /* calculate distance */
      var lat2 = childData.lat;
      var lon2 = childData.lon;

      var R = 6371; // Radius of the earth in km
      var dLat = (lat2 - lat1) * (Math.PI / 180); //await deg2rad(lat2 - lat1); // deg2rad below
      var dLon = (lon2 - lon1) * (Math.PI / 180);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      /* end calculate distance */

      companyResponse = new CompanyRequest(
        Object.keys(companies.val())[counter],
        childData.name,
        childData.address,
        childData.phone,
        childData.email,
        childData.lat,
        childData.lon,
        childData.logo,
        childData.status,
        d.toFixed(2)
      );
    }
    counter++;
    companiesResponse.push(companyResponse);
  });

  if (companyResponse === null) {
    responseBody.status = 404;
    responseBody.message = "Not found companies";
    responseBody.isSuccessFul = false;
    responseBody.data = null;
    return res.status(404).send({
      responseBody,
    });
  } else {
    return res.status(200).send({
      status: 200,
      message: "Success",
      isSuccessFul: true,
      data: companiesResponse,
    });
  }
};

module.exports = {
  registerCompany,
  getCompanies,
};
