const express = require('express')
const app = express()
const port = 3000
const randomUUID = require('crypto')
const { response } = require('express')
const database = []

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers
    const customer = database.find(custumer => custumer.cpf === cpf)

    if (!customer) {
        return response.status(400).json({ error: "Curstomer not found!" })
    }

    request.customer = customer

    return next()
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount
        } else {
            return acc - operation.amount
        }
    }, 0)

    return balance
}

app.post('/account', function (request, response) {
    const { cpf, name } = request.body
    const databaseAlreadyExists = database.some((data) => data.cpf === cpf)

    if (databaseAlreadyExists) {
        return response.status(400).json({ error: "Customer already exists!" })
    }

    database.push({
        cpf: 333333333,
        name: "Johnathan",
        id: randomUUID(),
        statement: []
    })

    return response.status(201).send()
})

app.get("/statement", verifyIfExistsAccountCPF, function (request, response) {
    const { customer } = request
    return response.json(customer.statement)
})

app.post("/deposit", verifyIfExistsAccountCPF, function (request, response) {
    const { description, amount } = request.body
    const { costumer } = request

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()
})

app.post("/withdraw", verifyIfExistsAccountCPF, function (request, response) {
    const { amount } = request.body
    const { customer } = request

    const balance = getBalance(customer.statement)

    if (balance < amount) {
        return response.status(400).json({ error: "Insufficient funds!" })
    }

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()
})

app.get("/statement/data", verifyIfExistsAccountCPF, function (request, response) {
    const { customer } = request;
    const { date } = request.query

    const dateFormat = new Date(date + " 00:00")

    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

    return response.json(statement)
})

app.put("/account", verifyIfExistsAccountCPF, function (request, response) {
    const { name } = request.body
    const { costumer } = request

    customer.name = name

    return response.status(201).send()
})

app.get("/account", verifyIfExistsAccountCPF, function (request, response) {
    const { costumer } = request

    return response.json(customer)
})

app.delete("/account", verifyIfExistsAccountCPF, function (request, response) {
    const { customer } = request

    database.splice(customer, 1)

    return response.status(200).json(database)
})

app.get("/balance", verifyIfExistsAccountCPF, function (request, response) {
    const { customer } = request
    const balance = getBalance(customer.statement)

    return response.json(balance)
})

app.listen(port)