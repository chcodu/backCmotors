var User = require("../models/user");
var UserRequest = require("../modelRequest/user");

const config = require("./config");

var db = config.db;


function home(req, res) {
  res.status(200).send({
    message: "Hola mundo desde el servidor de NodeJS",
  });
}

const login = async (req, res) => {
  const params = req.body;
  const email = params.email;
  const pass = params.password;

  if (email && pass) {
    var existUser = await db
      .ref("users")
      .orderByChild("email")
      .equalTo(email)
      .once("value", (snapshot) => {
        return snapshot;
      })
      .catch((err) => {
        return err;
      });

    if (existUser.val() === null) {
      return res.status(404).send({
        status: 404,
        message: "Email or Password is incorrect",
        isSuccessFul: false,
        data: null,
      });
    } else {
      var userResponse = null;
      existUser.forEach((childSnapshot) => {
        var childData = childSnapshot.val();
        if (childData !== null && pass === childData.password) {
          userResponse = new UserRequest(
            Object.keys(existUser.val())[0],
            childData.name,
            childData.surname,
            childData.phone,
            childData.email,
            childData.password,
            childData.img,
            childData.address,
            childData.status
          );
        }
      });
      if (userResponse === null) {
        return res.status(404).send({
          status: 404,
          message: "Email or Password is incorrect",
          isSuccessFul: false,
          data: null,
        });
      } else {
        return res.status(200).send({
          status: 200,
          message: "Success",
          isSuccessFul: true,
          data: [userResponse],
        });
      }
    }
  } else {
    return res.status(404).send({
      status: 404,
      message: "All fields are required",
      isSuccessFul: false,
      data: null,
    });
  }
};

// Register users
const saveUser = async (req, res) => {
  var params = req.body;
  var user = new User();

  if (
    params.name &&
    params.surname &&
    params.phone &&
    params.address &&
    params.email &&
    params.password
  ) {
    user.name = params.name;
    user.surname = params.surname;
    user.phone = params.phone;
    user.email = params.email;
    user.address = params.address;
    user.password = params.password;
    user.img = params.img;
    user.status = 'A';

    var existUser = await db
      .ref("users")
      .orderByChild("email")
      .equalTo(params.email)
      .once("value", (snapshot) => {
        return snapshot;
      })
      .catch((err) => {
        return err;
      });

    if (existUser.val() !== null) {
      return res.status(200).send({
        status: 200,
        message: "This email has already been registered",
        isSuccessFul: false,
        data: null,
      });
    }

    var keyColletion = await db
      .ref("users")
      .push(user)
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

    const newUser = await db
      .ref("users")
      .child(keyColletion.getKey())
      .once("value", (response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    if (newUser.val().email !== null) {
      var userResponse = new UserRequest(
        keyColletion.getKey(),
        newUser.val().name,
        newUser.val().surname,
        newUser.val().phone,
        newUser.val().email,
        newUser.val().password,
        newUser.val().img,
        newUser.val().address,
        newUser.val().status
      );

      return res.status(200).send({
        status: 200,
        message: "Success",
        isSuccessFul: true,
        data: [userResponse],
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
    return res.status(404).send({
      status: 404,
      message: "¡All fields are required!",
      isSuccessFul: false,
      data: null,
    });
  }
};

// // eslint-disable-next-line consistent-return
// const register = (req, res) => {
//   if (req.method !== "POST") {
//     // Return a "method not allowed" error
//     return res.status(405).send({
//       mensaje: "Is method type POST necesary",
//     });
//   }

//   const busboy = new Busboy({ headers: req.headers });
//   const tmpdir = "./assets/user/";

//   // This object will accumulate all the fields, keyed by their name
//   const fields = {};

//   // This object will accumulate all the uploaded files, keyed by their name.
//   const uploads = {};

//   var usr = new User();
//   // This code will process each non-file field in the form.
//   busboy.on("field", (fieldname, val) => {
//     //console.log(`Processed field ${fieldname}: ${val}.`);

//     fields[fieldname] = val;
//   });
//   // This code will process each file uploaded.
//   busboy.on("file", (fieldname, file, filename) => {
//     fields["img"] = filename;
//   });
//   const fileWrites = [];

//   // This code will process each file uploaded.
//   busboy.on("file", (fieldname, file, filename) => {
//     const filepath = tmpdir + filename;
//     uploads[fieldname] = filepath;

//     const writeStream = fs.createWriteStream(filepath);
//     file.pipe(writeStream);

//     const promise = new Promise((resolve, reject) => {
//       file.on("end", () => {
//         writeStream.end();
//       });
//       writeStream.on("finish", resolve);
//       writeStream.on("error", reject);
//     });
//     fileWrites.push(promise);
//   });

//   busboy.end(req.rawBody);

//   setTimeout(() => {
//     return saveUser(fields, res);
//   }, 2000);
// };


module.exports = {
  home,
  login,
  saveUser
};
