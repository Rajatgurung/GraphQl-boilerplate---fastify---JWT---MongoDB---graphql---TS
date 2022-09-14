import { hashSync } from 'bcryptjs'
import { ObjectID } from 'bson'
import { BCRYPT_SALT } from '../src/config'
export const user = {
   _id: new ObjectID(),
   email: 'test@test.com',
   password: hashSync('password', BCRYPT_SALT),
   name: 'name',
   actual: 'password',
}
