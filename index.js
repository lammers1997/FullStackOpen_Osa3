const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

morgan.token('postData', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body)
    }
    return
  });

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));


let people = [
    { 
      name: "Arto Hellas", 
      number: "040-123456",
      id: 1
    },
    { 
      name: "Ada Lovelace", 
      number: "39-44-5323523",
      id: 2
    },
    { 
      name: "Dan Abramov", 
      number: "12-43-234345",
      id: 3
    },
    { 
      name: "Mary Poppendieck", 
      number: "39-23-6423122",
      id: 4
    }
  ]

  const generateId = () => {
    min = Math.ceil(100);
    max = Math.floor(9999999);
    return Math.floor(Math.random() * (max - min) + min);}

  app.get('/api/persons/', (request, response) => {
    response.json(people)
  })

  app.get('/info', (request, response) => {
    const dateTime = new Date()
    response.send(`<P> Phonebook has info for ${people.length} people <\P> \n
    <P>${dateTime} <\P>`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    people = people.filter(person => person.id !== id)
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
    if (people.some(person => person.name === body.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    people = people.concat(person)
  
    response.json(person)
  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})