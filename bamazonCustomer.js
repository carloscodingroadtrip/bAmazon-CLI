var products = require("./products.js");
var inquirer = require("inquirer");

viewProducts(startShopping);

function startShopping() {
    console.clear();
    console.log("Let's shop");
    inquirer.prompt([{
        type: "input",
        name: "itemID",
        message: "Please type item id you want to purchase\n"

    },
    {
        type: "input",
        name: "itemQty",
        message: "Please enter quantity of the  item id you want to purchase\n"
    }]).then(function (answer) {
        //console.log(answer.itemQty);
        products.getProductDetail(answer.itemID, answer.itemQty);
    });
}

function viewProducts(callback) {
    products.getProducts(callback);
}