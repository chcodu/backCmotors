class UserRequest {
    constructor(id, name, surname, phone, email, password, img, address, status){
        this.id = id;
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

module.exports = UserRequest;