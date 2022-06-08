const express = require('express');
require('dotenv').config();
const colors = require('colors')
const graphql = require('express-graphql');
const schema = require('./schema/schema')
const port = process.env.PORT;
const connectDb = require('./config/db');

const app = express();
connectDb();

app.use('/graphql', graphql.graphqlHTTP({
    schema, graphiql : process.env.NODE_ENV === 'development' 
}))

app.listen(port, console.log(`listening on port ${port}`));

