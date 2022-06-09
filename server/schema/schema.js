// const {clients, projects} = require('../sampleData');

const Client = require('../models/Client')
const Project = require('../models/Project')

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } =require('graphql');

const projectType = new GraphQLObjectType({
    name : 'Project',
    fields: ()=> ({
        id : {type : GraphQLID},
        name: {type : GraphQLString}, 
        description: {type : GraphQLString}, 
        status: {type : GraphQLString},
        client : {
            type : clientType,
            resolve(parent, args){
                return Client.findById(parent.clientId)
            }
        }
    })

});


const clientType = new GraphQLObjectType({
    name : 'Client',
    fields: ()=> ({
        id : {type : GraphQLID},
        name: {type : GraphQLString}, email: {type : GraphQLString}, phone: {type : GraphQLString}
    })

});

const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields: {
        clients: {
            type : GraphQLList(clientType),
            resolve(parent, args){
                return Client.find();
            }
        },
        client : {
            type : clientType,
            args : { id : { type : GraphQLID}},
            resolve(parent, args){
                return Client.findById(args.id)
            }
        },
        projects: {
            type : GraphQLList(projectType),
            resolve(parent, args){
                return Project.find()
            }
        },
        project : {
            type : projectType,
            args : { id : { type : GraphQLID}},
            resolve(parent, args){
                return Project.findById(args.id);
            }
        }
    }
})

const mutationMethods = new GraphQLObjectType({
    name : 'mutation',
    fields: {
        addClient : {
            type : clientType,
            args : {
                name : {type : GraphQLNonNull(GraphQLString)}, 
                email : {type : GraphQLNonNull(GraphQLString)},
                phone : {type : GraphQLNonNull(GraphQLString)},
            }, 
            resolve(parent, args){
                const client = new Client({
                    name : args.name,
                    email : args.email,
                    phone : args.phone 
                });

                return client.save();
            }
        },
        deleteClient : {
            type: clientType,
            args: {
                id : { type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Client.findByIdAndRemove(args.id)
            }
        },
        addProject : {
            type : clientType,
            args : {
                name : {type : GraphQLNonNull(GraphQLString)}, 
                description : {type : GraphQLNonNull(GraphQLString)},
                status : {
                    type : new GraphQLEnumType({
                    name : 'ProjectStatus',
                    values: {
                        new: {value: "not started"},
                        progress : {value : 'in progress'},
                        done : {value: "Completed"}
                    }, 
                }),
                defaultValue : 'not started'
            },
            clientId : {type : GraphQLNonNull(GraphQLID)}
            }, 
            resolve(parent, args){
                const client = new Project({
                    name : args.name,
                    email : args.email,
                    phone : args.phone 
                });

                return Project.save();
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation : mutationMethods
})