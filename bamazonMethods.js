var mySqlConnection = require("./dbconnection.js");
var connection = new mySqlConnection("bamazon");
var inquirer = require('inquirer');
var Table = require("easy-table");

/** DISPLAY PRODUCTS */
exports.getProducts = function (callback) {
    var sql = "SELECT * FROM products";
    connection.getConnection();
    connection.dbConnection.query(sql, function (err, res) {
        if (err) throw err;
        var mytable = new Table;
        res.forEach(element => {
            mytable.cell("Product Id", element.item_id);
            mytable.cell("Product Name", element.product_name);
            mytable.cell("Price", element.price);
            mytable.cell("Qty in Stock", element.stock_qty);
            mytable.newRow();
        });
        console.log(mytable.toString());
        if (callback) {
            return callback(null);
        }
    });
};

exports.updateInventory = function (id, oroginalQty, qty, product_sales, addFlag) {
    var finalQty = 0;
    if (addFlag) {
        finalQty = parseInt(oroginalQty) + parseInt(qty);
    }
    else {
        finalQty = oroginalQty - qty;
    }
    var sql = "UPDATE products SET ? WHERE?";
    connection.getConnection();
    connection.dbConnection.query(sql, [
        {
            stock_qty: finalQty,
            product_sales: product_sales
        },
        {
            item_id: id
        }
    ], function (err, res) {
        if (err) throw err;
    });
};

/**Low inventrory */
exports.getLowInventory = function (qty) {
    // console.log(id,qty);
    var sql = "SELECT * FROM products WHERE stock_qty < 6";
    connection.getConnection();
    connection.dbConnection.query(sql,
        function (err, res) {
            if (err) throw err;
            var t = new Table;
            res.forEach(element => {
                t.cell("Product Id", element.item_id);
                t.cell("Product Name", element.product_name);
                t.cell("Price", element.price);
                t.cell("Qty in Stock", element.stock_qty);
                t.newRow();
            });
            console.log(t.toString());
        });
};

/**Add new product to inventrory */
exports.addNewProduct = function() {
    console.clear();
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "Product Name?"
        },
        {
            type: "input",
            name: "productDept",
            message: "Product Department?"
        },
        {
            type: "input",
            name: "productPrice",
            message: "Product Price?"
        },
        {
            type: "input",
            name: "productQty",
            message: "Product stock?"
        }
    ]).then(function (newProduct) {
        // createProduct(newProduct.productName, parseFloat(newProduct.productPrice), newProduct.productDept, newProduct.productQty);

        var querySQL = "INSERT INTO products SET?";
        connection.getConnection();
        connection.dbConnection.query(querySQL, {
            product_name: newProduct.productName,
            department_name: newProduct.productDept,
            price: newProduct.productPrice,
            stock_qty: newProduct.productQty
        }, function (err, res) {
            if (err) throw err;
            exports.getProducts();
            console.log('Product has been recorded.');
        });
    });
};

/** Read products */
exports.getProductDetail = function (id, qty, flag) {
    // console.log(id,qty);
    var sql = "SELECT * FROM products WHERE?";
    connection.getConnection();
    connection.dbConnection.query(sql, { item_id: id }, function (err, res) {
        if (err) throw err;
        if (flag) {
            exports.updateInventory(id, res[0].stock_quantity, qty, 0, flag);
        }
        else {
            var product_sales = 0;
            if (res[0].stock_quantity >= qty) {
                var t = new Table;
                product_sales = parseFloat(res[0].product_sales) + qty, parseFloat(res[0].price) * parseInt(qty)
                t.cell("Product Id", res[0].item_id);
                t.cell("Product Name", res[0].product_name);
                t.cell("Total", parseFloat(res[0].price) * parseInt(qty));
                t.newRow();
                console.log(t.toString());
                console.log("Thank you for your order.");
                exports.updateInventory(id, res[0].stock_quantity, product_sales, flag);
            }
            else {
                console.log("Sorry , we do not have this item in the stock");
            }
        }
    });
};

//  updateProduct() {
//     console.clear();
//     inquirer.prompt([
//         {
//             type: "input",
//             name: "productId",
//             message: "Product Id?"
//         },
//         {
//             type: "input",
//             name: "productQty",
//             message: "Product Qty?"
//         }
//     ]).then(function (product) {
//         methods.getProductDetail(product.productId, product.productQty, true);
//     });
// }
