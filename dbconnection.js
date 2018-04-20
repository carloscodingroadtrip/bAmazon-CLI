var mysql = require("mysql");

module.exports = function Connection(database) {
    this.database = database;
    this.dbConnection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: this.database
    });

    this.getConnection = function () {
        //If we are disconnected from the database
        if (this.dbConnection.state === "disconnected") {
            //connect to the database - Open the gate
            this.dbConnection.connect(function (err) {
                if (err) throw err;
            });
        }
    };

    this.endConnection = function () {
        this.dbConnection.end(function (err) {
            if (err) throw err;
        });
    };
};