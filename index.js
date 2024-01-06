require('dotenv').config()

const express = require('express')
const app = express()
const Person = require('./models/person')

const cors = require('cors')
const morgan = require('morgan')
app.use(express.static('dist'))
app.use(express.json())
//app.use(requestLogger)

app.use(cors())

app.use(morgan('tiny'))

morgan.token('postData', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));



const generateId = () => {
    min = Math.ceil(100);
    max = Math.floor(9999999);
    return Math.floor(Math.random() * (max - min) + min);
}

//GET all persons
app.get('/api/persons/', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

//Get info of phonebook
app.get('/info', (request, response, next) => {
    const dateTime = new Date()
    Person.countDocuments({})
        .then(count => {
            response.send(`<P> Phonebook has info for ${count} people <\P> \n
               <P>${dateTime} <\P>`)
        })
        .catch(error => next(error))
})

//GET person by id
app.get('/api/persons/:id', (request, response, next) => {
    console.log("Get by id")
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

//delete one person
app.delete('/api/persons/:id', (request, response) => {

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

})

//add new person
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))

})

//Change person's number
app.put('/api/persons/:id', (request, response, next) => {

    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})