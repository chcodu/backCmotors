class User {
    constructor(name, surname, phone, email, password, img, address, status){
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.img = img;
        this.address = address;
        this.status = status;
    }
}

module.exports = User;