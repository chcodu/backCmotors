class CompanyRequest {
    constructor(id, name, address, phone, email, lat, lon, logo, status, distance){
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.lat = lat;
        this.lon = lon;
        this.logo = logo;
        this.status = status;
        this.distance = distance;
    }
}

module.exports = CompanyRequest;