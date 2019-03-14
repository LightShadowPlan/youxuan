/**
 * Created by qiangxl on 2019/3/13.
 */
const express = require('express')
const app = express()
const {graphql} = require('graphql')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.use('/test', (req, res) => {

  let query = `
      query abc {
          num,
          hello 
      }
  `
  graphql(schema, query).then(result => {
    res.json(result)
  })

})
app.use('/articles', (req, res) => {
  let query = `
      query abc {
          articles {
            title,
            authorId,
            authorInfo {
                name
            }
          }
      }
  `
  graphql(schema, query).then(result => {
    res.json(result)
  })

})


app.listen(3000)