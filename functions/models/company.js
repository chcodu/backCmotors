class Company{
    constructor(name, address, phone, email, lat, lon, logo, status){
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.lat = lat;
        this.lon = lon;
        this.logo = logo;
        this.status = status;
    }
}

module.exports = Company;