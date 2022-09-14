import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus'
import * as UserResolver from './user.resolver'

export const User = objectType({
   name: 'User',
   definition: (t) => {
      t.id('_id')
      t.string('name')
      t.string('email')
      t.string('profilePicture')
   },
})

export const CreateAccount = extendType({
   type: 'Mutation',
   definition: (t) => {
      t.field('createAccount', {
         type: RegisterResponse,
         args: {
            payload: nonNull(registerUser),
            profilePic: arg({ type: 'Upload' }),
         },
         resolve: UserResolver.registerUser,
      })
   },
})

const RegisterResponse = objectType({
   name: 'registerResponse',
   definition: (t) => {
      t.nonNull.string('message')
      t.nonNull.boolean('error')
      t.string('_id')
   },
})

const registerUser = inputObjectType({
   name: 'registrationUserPayload',
   definition: (t) => {
      t.nonNull.string('email')
      t.nonNull.string('name')
      t.nonNull.string('password')
   },
})

export const loginUser = extendType({
   type: 'Mutation',
   definition(t) {
      t.field('loginUser', {
         type: LoginResponse,
         args: { payload: nonNull(LoginUserInput) },
         resolve: UserResolver.loginUser,
      })
   },
})

const LoginResponse = objectType({
   name: 'loginResponse',
   definition: (t) => {
      t.nonNull.string('message')
      t.nonNull.boolean('error')
      t.string('token')
      t.field('user', {
         type: User,
      })
   },
})

const LoginUserInput = inputObjectType({
   name: 'loginInUserInput',
   definition(t) {
      t.nonNull.string('email')
      t.nonNull.string('password')
   },
})

export const Me = extendType({
   type: 'Query',
   definition: (t) => {
      t.field('me', {
         type: objectType({
            name: 'meData',
            definition(t) {
               t.boolean('error')
               t.string('message')
               t.field('user', {
                  type: User,
               })
            },
         }),
         resolve: UserResolver.me,
      })
   },
})
