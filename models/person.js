const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function (number) {
                // Check if the phone number matches the specified format
                const phoneRegex = /^(\d{2})-(\d{6,})$|^(\d{3})-(\d{5,})$/
                return phoneRegex.test(number)
            },
            message: props => `${props.value} is not a valid phone number. It must contain atleast 8 digits and the frist part must bee 2-3 digits long`,
        },
        required: [true, 'Person phone number is required'],
    },

})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Person', personSchema)