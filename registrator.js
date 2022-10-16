const {Database} = require('./database');
const { Entity } = require('./entity');

module.exports.Registrator = class Registrator {
    constructor() {
        this.database = new Database();
    }

    async checkUser(userData) {
        if(!userData["login"]) {
            return '{"error": true, "message": "no login"}';
        }

        if(!userData["password"]) {
            return '{"error": true, "message": "no password"}';
        }

        var requiredUser = await this.database.selectJSONCategory("Customers", {"login":userData["login"]});
        if(requiredUser.length > 1) {
            console.error("More than one user of " + userData["login"]);
            return '{"error": true, "message": "internal error"}';
        }
        if(requiredUser.length == 0) {
            return '{"error": true, "message": "Not found"}';
        }

        if(requiredUser[0]["password"] == userData["password"]) {
            return '{"error": false, "message": "' + requiredUser[0]["id"] + '"}';
        }

        return '{"error": true, "message": "password does not match"}';
    }

    async createNewUser(userData) {
        console.log(userData);

        var entity = new Entity("Customers", {
            login: userData["login"],
            password: userData["password"],
            orders_history: [],
            orders_not_complete: [],
            orders_complete: []
        });

        var userId = await this.database.saveJSON(entity);
        console.log("Created user " + userData["login"] + " with id " + userId)

        return '{"error": false, "message":"' + userId + '"}';
    }
}