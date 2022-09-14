import { FastifyMongoObject, ObjectId } from '@fastify/mongodb'
import {
   FastifyInstance,
   RawServerDefault,
   FastifyBaseLogger,
   FastifyTypeProviderDefault,
} from 'fastify'
import { IncomingMessage, ServerResponse } from 'http'
export interface Context {
   db: FastifyMongoObject['db']
   jwt: FastifyInstance<
      RawServerDefault,
      IncomingMessage,
      ServerResponse<IncomingMessage>,
      FastifyBaseLogger,
      FastifyTypeProviderDefault
   >['jwt'],
   user:{
      _id:string,
      
   }
}
