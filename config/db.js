const mongoose = require('mongoose')
const config = require('config')
const connectDB = async () => {
  try {
    await mongoose.connect(
         process.env.mongoUri,
      {
        // added to avoid bugs
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
      {    autoIndex :true 
      }
    )

    console.log('MongoDB is connected!')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}
module.exports = connectDB
