import { createMercuriusTestClient } from 'mercurius-integration-testing'
import { app } from '../src/server'
import { graphql } from 'graphql'
import { FastifyInstance } from 'fastify'
import { expect } from 'chai'
import { COLLECTION } from '../src/constant/DB'
import * as testData from './testData'

describe('User Testing', async () => {
   let client: ReturnType<typeof createMercuriusTestClient>,
      server: FastifyInstance,
      token: string = ''

   before(async () => {
      server = await app(true)
      await server.mongo.db?.collection(COLLECTION.users).insertOne({
         name: testData.user.name,
         email: testData.user.email,
         password: testData.user.password,
         _id: testData.user._id,
      })
      client = createMercuriusTestClient(server)
      token = await server.jwt.sign(testData.user)
   })

   describe('Create user', () => {
      it('should throw error with empty user payload', async () => {
         const query = `#graphql
            mutation{
               createAccount(){}
            }
         `
         const res = await client.mutate(query)
         expect(res).has.property('errors')
         expect(res.errors).to.be.an('array')
      })

      it('check for password length', async () => {
         const query = `#graphql
          mutation{
            createAccount(payload:{
                  email:"email@email.com",
                  name:"name",
                  password:"pass"
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { createAccount },
         } = await client.mutate(query)
         expect(createAccount).to.have.property('error')
         expect(createAccount.error).to.eq(true)
         expect(createAccount.message).to.include('password')
      })

      it('check for empty password', async () => {
         const query = `#graphql
          mutation{
            createAccount(payload:{
                  email:"email@email.com",
                  name:"name",
                  password:""
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { createAccount },
         } = await client.mutate(query)
         expect(createAccount).to.have.property('error')
         expect(createAccount.error).to.eq(true)
         expect(createAccount.message).to.include('password')
      })

      it('check for empty name', async () => {
         const query = `#graphql
          mutation{
            createAccount(payload:{
                  email:"email@email.com",
                  name:"",
                  password:"password"
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { createAccount },
         } = await client.mutate(query)
         expect(createAccount).to.have.property('error')
         expect(createAccount.error).to.eq(true)
         expect(createAccount.message).to.include('name')
      })

      it('check for proper email', async () => {
         const query = `#graphql
          mutation{
            createAccount(payload:{
                  email:"emailemail.com",
                  name:"name",
                  password:"password"
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { createAccount },
         } = await client.mutate(query)

         expect(createAccount).to.have.property('error')
         expect(createAccount.error).to.eq(true)
         expect(createAccount.message).to.include('email')
      })

      it('check for empty email', async () => {
         const query = `#graphql
          mutation{
            createAccount(payload:{
                  email:"",
                  name:"name",
                  password:"password"
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { createAccount },
         } = await client.mutate(query)

         expect(createAccount).to.have.property('error')
         expect(createAccount.error).to.eq(true)
         expect(createAccount.message).to.include('email')
      })

      it('should register user', async () => {
         const query = `#graphql
          mutation{
            createAccount(payload:{
                  email:"somewere@someone.com",
                  name:"name",
                  password:"password"
               }){
                  error
                  message
                  _id
               }
            }
         `
         const {
            data: { createAccount },
         } = await client.mutate(query)

         expect(createAccount).to.have.property('message')
         expect(createAccount).to.have.property('_id')
         expect(createAccount.error).to.eq(false)
         expect(createAccount.message).to.include('created')
      })

      it('should not register user with same email', async () => {
         const query = `#graphql
          mutation{
            createAccount(payload:{
                  email:"test@test.com",
                  name:"name",
                  password:"password"
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { createAccount },
         } = await client.mutate(query)

         expect(createAccount).to.have.property('message')
         expect(createAccount.error).to.eq(true)
         expect(createAccount.message).to.include('already exists')
      })
   })

   describe('Loin user', () => {
      it('should throw error with empty email payload', async () => {
         const query = `#graphql
            mutation{
               loginUser(){}
            }
         `
         const res = await client.mutate(query)
         expect(res).has.property('errors')
         expect(res.errors).to.be.an('array')
      })

      it('check for empty password', async () => {
         const query = `#graphql
          mutation{
            loginUser(payload:{
                  email:"email@email.com",
                  password:""
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { loginUser },
         } = await client.mutate(query)
         expect(loginUser).to.have.property('error')
         expect(loginUser.error).to.eq(true)
         expect(loginUser.message).to.include('password')
      })

      it('check for proper email', async () => {
         const query = `#graphql
          mutation{
            loginUser(payload:{
                  email:"emailemail.com",
                  password:"password"
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { loginUser },
         } = await client.mutate(query)

         expect(loginUser).to.have.property('error')
         expect(loginUser.error).to.eq(true)
         expect(loginUser.message).to.include('email')
      })

      it('check for empty email', async () => {
         const query = `#graphql
          mutation{
            loginUser(payload:{
                  email:"",
                  password:"password"
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { loginUser },
         } = await client.mutate(query)

         expect(loginUser).to.have.property('error')
         expect(loginUser.error).to.eq(true)
         expect(loginUser.message).to.include('email')
      })

      it('should not login for incorrect email and password', async () => {
         const query = `#graphql
          mutation{
            loginUser(payload:{
                  email:"test2@test.com",
                  password:"password"
               }){
                  error
                  message
               }
            }
         `
         const {
            data: { loginUser },
         } = await client.mutate(query)

         expect(loginUser).to.have.property('error')
         expect(loginUser.error).to.eq(true)
         expect(loginUser.message).to.include('Wrong')
      })
      it('should login and get token', async () => {
         const query = `#graphql
          mutation{
            loginUser(payload:{
                  email:"test@test.com",
                  password:"password"
               }){
                  error
                  message
                  token
               }
            }
         `
         const {
            data: { loginUser },
         } = await client.mutate(query)

         expect(loginUser).to.have.property('error')
         expect(loginUser.error).to.eq(false)
         expect(loginUser.token).to.be.an('string')
         expect(loginUser.message).to.include('success')
      })
   })

   describe('Me', () => {
      it('should not allow public to access', async () => {
         const query = `#graphql
         query{
               me{
                  message
               }
            }
      `
         const res = await client.query(query)
         expect(res).has.property('errors')
         expect(res.errors).to.be.an('array').that.contains
         expect(res.errors?.shift() || { message: '' }).to.property(
            'message',
            'Unauthenticated user!'
         )
      })

      it('should get user data', async () => {
         const query = `#graphql
         query{
            me{
               error
               message
               user{
                  email
               }
            }
         }
      `
         const res = await client.query(query, {
            headers: {
               authorization: `Bearer ${token}`,
            },
         })
         const {
            data: { me },
         } = res
         expect(me.error).to.be.eq(false)
         expect(me.user.email).to.be.eql(testData.user.email)
      })
   })

   after(() => {
      server.mongo.db?.dropCollection(COLLECTION.users)
      server.close()
   })
})
