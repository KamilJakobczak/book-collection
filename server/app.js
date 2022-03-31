const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/schema');

const app = express();

app.use(cors());

mongoose.connect(
  'mongodb+srv://admin:JxVmS7mp0k2orcePvwbZ@cluster0.qwqgz.mongodb.net/Cluster0?retryWrites=true&w=majority'
);

mongoose.connection.once('open', () => {
  console.log('database connected');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log('now listening for requests on port 4000');
});
