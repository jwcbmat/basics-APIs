const express = require('express')
const app = express()
const port = 3000
const randomUUID = require('crypto')
const Database = new Map()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/account', function (request, response) {
    const { cpf, name } = request.body
    const id = randomUUID()

    Database.push( {
        cpf,
        name,
        id,
        statement: []
    })

    return response.status(201).send()
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})