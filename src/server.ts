import Fastify, { FastifyInstance, FastifyRegisterOptions } from 'fastify'
import fastifyMongodb, { ObjectId } from '@fastify/mongodb'
import fastifySwagger from '@fastify/swagger'
import fastifyJwt from '@fastify/jwt'
import mercurius, { MercuriusOptions } from 'mercurius'
import { schema } from './schema'
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from './utils/rules'
import fastifyEnv from '@fastify/env'
import envSchema from './utils/envSchema'
import fs from 'fs'
import path from 'path'

//@ts-ignore
const processRequest: any = require('graphql-upload/processRequest.js')

declare interface WriteStream extends fs.WriteStream {
   createReadStream(option: any): any
}

export const app = async (testing = false) => {
   const server: FastifyInstance = Fastify({
      logger: !!!testing,
   })
   await server.register(fastifyEnv, {
      schema: envSchema,
      dotenv: {
         path: `${__dirname}/../${testing ? 'testing.env' : '.env'}`,
      },
   })

   await server.register(fastifyMongodb, {
      url: process.env.MONGO_URL,
   })

   await server.register(fastifySwagger, {
      routePrefix: '/doc',
      exposeRoute: true,
   })

   await server.register(fastifyJwt, {
      secret: process.env.JWT_SECRET || 'secret',
   })

   server.addContentTypeParser(
      'multipart',
      (req: any, reply: any, done: any) => {
         req.isMultipart = true
         done()
      }
   )

   server.addHook('preValidation', async function (request, reply) {
      if (!(request as any).isMultipart) {
         return
      }

      request.body = await processRequest(request.raw, reply.raw, {
         maxFileSize: 10000000, // 10 MB
         maxFiles: 20,
      })
   })

   server.addHook('onRequest', async (request, reply) => {
      try {
         if (request.headers.authorization) {
            await request.jwtVerify()
            ;(request.user as Record<any, any>)._id = new ObjectId(
               (request.user as Record<any, any>)._id
            )
         }
      } catch (err) {}
   })

   const opts: FastifyRegisterOptions<MercuriusOptions> = {
      schema: applyMiddleware(schema, permissions),
      graphiql: true,
      context: (req, rep) => {
         return {
            db: server.mongo.db,
            user: req.user,
            jwt: server.jwt,
         }
      },
   }

   server.register(require('@fastify/static'), {
      root: path.join(__dirname, '../assets'),
      prefix: '/public/',
   })

   await server.register(mercurius, opts)
   if (testing) return server
   try {
      await server.listen({ port: 5000, host: '0.0.0.0' })
      const address = server.server.address()
      const port = typeof address === 'string' ? address : address?.port
      server.log.info(`server listening on ${port}`)
   } catch (err) {
      server.log.error(err)
      process.exit(1)
   }
   return server
}
