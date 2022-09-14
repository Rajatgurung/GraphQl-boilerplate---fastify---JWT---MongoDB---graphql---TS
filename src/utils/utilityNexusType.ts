//@ts-ignore
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { asNexusMethod } from 'nexus'

export const Upload = asNexusMethod(GraphQLUpload, 'upload')
