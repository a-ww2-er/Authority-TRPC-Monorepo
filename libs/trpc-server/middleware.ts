import { TRPCError } from '@trpc/server'
import { t } from './trpc'
import { Role } from './types'
import { JwtPayload, verify } from 'jsonwebtoken'
import { authorizeUser } from './util'

// export const isAuthed = (...roles:Role[])=>
//     {}
export const isAuthed = (...roles: Role[]) =>
  t.middleware(async (options) => {
    const { token } = options.ctx
    if (!token) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Token not found',
      })
    }
    console.log('token', token)
    let uid
    try {
      const user = await verify(token, process.env.NEXTAUTH_SECRET || '')
      uid = (user as JwtPayload).uid
    } catch (error) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid token',
      })
    }
    if (roles.length > 0) {
      await authorizeUser(uid, roles)
    }
    //add the uid to the context
    return options.next({ ...options, ctx: { ...options.ctx, uid } })
  })
