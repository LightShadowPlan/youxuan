/**
 * Created by qiangxl on 2019/3/13.
 */

const axios = require('axios')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = require('graphql')

const authorQueryType = new GraphQLObjectType({
  name: 'author',
  fields: {
    name: {
      type: GraphQLString
    }
  }
})

const articleQueryType = new GraphQLObjectType({
  name: 'articles',
  fields: {
    id: {
      type: GraphQLInt
    },
    title: {
      type: GraphQLString
    },
    authorId: {
      type: GraphQLInt
    },
    authorInfo: {
      type: authorQueryType,
      resolve (obj) {
        return axios.get(`http://localhost:9000/users/${obj.authorId}`).then(res => res.data)
      }
    }
  }
})

const rootQueryType = new GraphQLObjectType({
  name: 'root',
  fields: {
    hello: {
      type: GraphQLString,
      resolve () {
        return 'Hello World'
      }
    },
    num: {
      type: GraphQLInt,
      resolve() {
        return 123
      }
    },
    articles: {
      type: new GraphQLList(articleQueryType),
      resolve () {
        return axios.get('http://localhost:9000/articles').then(res => res.data)
      }
    }

  }
})
const schema = new GraphQLSchema({
  query: rootQueryType
})

module.exports = schema