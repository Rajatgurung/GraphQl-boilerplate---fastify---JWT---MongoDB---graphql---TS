import { FieldResolver } from 'nexus'
import { COLLECTION } from '../constant/DB'
import Bcrypt from 'bcryptjs'
import {
   userLoginValidation,
   userRegistrationValidation,
} from './user.validation'
import { BCRYPT_SALT } from '../config'
import saveFile from '../utils/saveFile'

export const me: FieldResolver<'Query', 'me'> = async (_, {}, { db, user }) => {
   try {
      const userData = await db
         ?.collection(COLLECTION.users)
         .findOne({ _id: user._id })
      return {
         error: false,
         message: 'success',
         user: {
            ...userData,
            _id: `${userData?._id}`,
         },
      }
   } catch (e: any) {
      return {
         error: true,
         message: e.message,
      }
   }
}

export const registerUser: FieldResolver<'Mutation', 'createAccount'> = async (
   _,
   { payload, profilePic },
   { db }
) => {
   try {
      //validating schema
      await userRegistrationValidation.validate(payload)

      //handling file
      const c = await profilePic
      let profilePicture = ''
      if (!!c) {
         if (c.mimetype != 'image/jpeg')
            throw new Error('File not supported upload JPG file')
         profilePicture = (await saveFile(c)).fileName
      }

      //validating if user already exist
      const existingUser = await db
         ?.collection(COLLECTION.users)
         .findOne({ email: payload.email })

      if (existingUser) throw new Error('User already exists')

      //hashing password
      let { password, ...other } = payload
      password = Bcrypt.hashSync(password, BCRYPT_SALT)
      //seeding user
      const res = await db
         ?.collection(COLLECTION.users)
         .insertOne({ ...other, password, profilePicture })

      return {
         message: 'created',
         error: false,
         _id: res?.insertedId.toString(),
      }
   } catch (e: any) {
      return {
         error: true,
         message: e.message,
      }
   }
}

export const loginUser: FieldResolver<'Mutation', 'loginUser'> = async (
   _,
   { payload },
   { db, jwt }
) => {
   try {
      await userLoginValidation.validate(payload)
      const user = await db
         ?.collection(COLLECTION.users)
         .findOne({ email: payload.email })

      if (!user || !(await Bcrypt.compare(payload.password, user.password)))
         throw Error('Email or Password Wrong')
      const { password, ...responseUserData } = user
      const token = jwt.sign(responseUserData)
      return {
         error: false,
         message: 'success',
         token,
         user: {
            ...responseUserData,
            _id: `${responseUserData?._id}`,
         },
      }
   } catch (e: any) {
      return {
         error: true,
         message: e.message,
         user: {},
      }
   }
}
