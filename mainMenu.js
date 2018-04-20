var inquirer = require("inquirer");
var methods = require("./bamazonMethods.js");

module.exports = function() {
    console.clear();
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            choices: ["View Products for Sale", "View Low Inventory", "Add New Product"],
            message: "Please select option"
        }
    ]).then(function (answer) {
        //console.log(answer);
        switch (answer.menu) {
            case "View Products for Sale":
                methods.getProducts();
                break;
            case "View Low Inventory":
                methods.getLowInventory(5);
                break;
            case "Add New Product":
                methods.addNewProduct();
                break;
            default:
                break;
        }
    });
};