import { shield, rule } from 'graphql-shield'
import { IRuleResult } from 'graphql-shield/dist/types'
import { Context } from '../types/context'

export const rules = {
   isAuthenticatedUser: rule({ cache: 'contextual' })(
      async (_parent, _args, ctx: Context): Promise<IRuleResult> => {
         try {
            if (!ctx.user?._id) {
               return Error('Unauthenticated user!')
            }
            return true
         } catch (e: any) {
            return e
         }
      }
   ),
}

export const permissions = shield({
   Query: {
      me: rules.isAuthenticatedUser,
   },
})
