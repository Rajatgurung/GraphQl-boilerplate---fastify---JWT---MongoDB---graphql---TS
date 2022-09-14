import * as Yup from 'yup'
import { User } from './user.interference'
export const userRegistrationValidation: Yup.SchemaOf<Omit<User, '_id'>> =
   Yup.object({
      email: Yup.string().required().email(),
      name: Yup.string().required(),
      password: Yup.string().required().min(6),
      profilePicture: Yup.string().nullable().url() as Yup.StringSchema<string>,
   })

export const userLoginValidation: Yup.SchemaOf<
   Pick<User, 'email' | 'password'>
> = Yup.object({
   email: Yup.string().required().email(),
   password: Yup.string().required(),
})
