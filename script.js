const express = require('express')
var bodyParser = require('body-parser');
const fs = require("fs");
const PORT = 3000

const app = express()

// class Customer {
//     constructor(id, name, surname, age, role) {
//         this.id = id        
//         this.name = name        
//         this.surname = surname
//         this.age = age
//         this.role = role
//     }
// }

// const customerList = [
//     new Customer(1, "John", "Doe", 45, "Software Engineer"),
//     new Customer(2, "Lelu", "Smith", 21, "Developer"),
//     new Customer(3, "Hank", "Benekkie", 28, "Manager"),
//     new Customer(4, "Walter", "White", 32, "Sysytem Administartor"),
// ]

const {customers, orders} = require('./mockData.json')
const {CustomError} = require('./customErrors')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/customer/:id/orders", (req, res) => {
    const {id} = req.params
    const ordersList = customers.find(customer => customer.id == id).ordersIds
    res.send(orders.filter(order => ordersList.includes(order.id)))
})

app.get("/customers/orders", (req, res) => {
    let {maxCount: count} = req.query
    if(isNaN(count)) new CustomError("TYPO", 406, "Please make sure the order value is a numeric type");
    if(parseInt(count) == 0) new CustomError("VALUE", 406, "Please make sure the order number has a numeric value and count can't be 0");
    
    count = parseInt(count)

    const hasOrders = customers.filter(customer => (customer.ordersIds? customer.ordersIds.length: 0) <= count)
    if (hasOrders.length) res.status(200).send(hasOrders)
    res.status(202).send({"message": "No users found who has specifies amount of orders"})
})

//read
app.get("/customers", (req, res) => {
    const {id} = req.query
    res.send(id? customers.find(customer => customer.id == id): customers)
})

//add
app.put("/customer", (req, res) => {
    const newCustomer = req.body;
    newCustomer.id = customers.length+1
    customers.push(newCustomer)
    addToFIle(newCustomer)
    res.status(201)
    res.send(newCustomer)
})

//update
app.post("/customer", (req, res) => {
    const newCustomer = req.body;
    const customer = customers.findIndex(customer => customer.id == newCustomer.id)
    customers[customer] = newCustomer
    res.status(201)
    res.send(newCustomer)
})

//delete
app.delete("/customer", (req, res) => {
    const {id} = req.query
    const removed = customers.splice(customers.findIndex(customer => customer.id == id), 1)
    res.status(204)
    res.send(removed.length? {"reponse": "The user has been deleted"}: {"response": "Not found the user"})
})

app.get("/orders", (req, res) => {
    const {id} = req.query
    res.send(id? orders.find(order => order.id == id): orders)
})


// app.get("/customers/:id", (req, res) => {
//     const {id} = req.params
//     res.send(customers.find(customer => customer.id == id))
// })


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})

const addToFIle = (newcustomers) => {
    // Storing the JSON format customers in myObject
    const customers = fs.readFileSync("mockcustomers.json");
    const myObject = JSON.parse(customers);
  
    // Adding the new customers to our object
    myObject.push(newcustomers);
    
    // Writing to our JSON file
    const newcustomers2 = JSON.stringify(myObject);
    fs.writeFile("mockcustomers.json", newcustomers2, (err) => {
    // Error checking
    if (err) throw err;
    console.log("New customers added");
});
}