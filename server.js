// Tutorial: https://zellwk.com/blog/crud-express-mongodb/

// Use express in server.js by requiring it
const express = require('express');
const bodyParser= require('body-parser'); // help tidy up the request object before we use them 
const MongoClient = require('mongodb').MongoClient // Connect to MongoDB through the connect method
const app = express();

// require('./dotenv')

const connectionString = 'mongodb+srv://yoda:yodababy@cluster0-fwnmy.mongodb.net/test?retryWrites=true&w=majority'
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(quotes => {
          res.render('index.ejs', { quotes: quotes })
        })
        .catch(/* ... */)
    })

    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    })

    // ========================
    // Listen
    // ========================
    // const isProduction = process.env.NODE_ENV === 'production'
    // const port = isProduction ? 7500 : 3000
    const port = 3000 
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)
// MongoClient.connect(connectionString, { 
// useUnifiedTopology: true })
//   .then(client => {
//     console.log('Connected to Database')
//     const db = client.db('star-wars-quotes') // set name for database
//     const quotesCollection = db.collection('quotes')

//     app.set('view engine', 'ejs')
//     app.use(bodyParser.urlencoded({ extended: true }))
//     app.use(bodyParser.json()) // teach the server to read JSON file
//     app.use(express.static('public'))

//     app.get('/', (req, res) => {
//         db.collection('quotes').find().toArray()
//             .then(results => {
//                 res.render('index.ejs', { quotes: results })
//             })
//             .catch(error => console.error(error))
//         // ...
//     })

//     app.post('/quotes', (req, res) => {
//         // console.log(req.body)
//         quotesCollection.insertOne(req.body)
//             .then(result => {
//                 res.redirect('/')
//             })
//             .catch(error => console.error(error))
//     })

//     app.put('/quotes', (req, res) => {
//         quotesCollection.findOneAndUpdate(
//             { name: 'Yoda' },
//             {
//               $set: {
//                 name: req.body.name,
//                 quote: req.body.quote
//               }
//             },
//             {
//               upsert: true
//             }
//           )
//             .then(result => res.json('Success'))
//             .catch(error => console.error(error))
//     })

//     app.delete('/quotes', (req, res) => {
//         quotesCollection.deleteOne(
//             { name: req.body.name }
//         )
//         .then(result => {
//             if (result.deletedCount == 0) {
//                 return res.json('No quote to delete')
//             }
//             res.json(`Deleted Darth Vadar's quote`)
//         })
//         .catch(error => console.error(error))
//     })

//     app.listen(3000, function() {
//         console.log('listening on 3000')
//     })
//   })
//   .catch(error => console.error(error))




