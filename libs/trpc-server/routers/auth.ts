// import { prisma } from '@foundation-trpc/db'
import { prisma } from '@authority-trpc/db'
import { privateProcedure, publicProcedure, router } from '../trpc'
import { formSchemaRegister, formSchemaSignin } from '../../forms/src/schema'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { AuthProviderType } from '@authority-trpc/db/types'
import { v4 as uuid } from 'uuid'
import { sign } from 'jsonwebtoken'
// export const authRoutes = router({})

export const authRoutes = router({
  users: publicProcedure.query(({ ctx }) => {
    return prisma.user.findMany()
  }),
  signIn: publicProcedure
    .input(formSchemaSignin)
    .mutation(async ({ input: { email, password } }) => {
      const credentials = await prisma.credentials.findUnique({
        where: { email },
        include: { user: true },
      })

      if (!credentials) {
        throw new Error('Invalid email or password')
      }

      if (!bcrypt.compareSync(password, credentials.passwordHash)) {
        throw new Error('Invalid email or password')
      }

      const token = sign(
        { uid: credentials.uid },
        process.env.NEXTAUTH_SECRET || '',
      )

      return {
        user: credentials.user,
        token,
      }
    }),
  registerWithCredentials: publicProcedure
    .input(formSchemaRegister)
    .mutation(async ({ input: { email, password, image, name } }) => {
      console.log('reaches here')

      const existinguUser = await prisma.credentials.findUnique({
        where: { email },
      })
      if (existinguUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User already exists with this email',
        })
      }
      const salt = bcrypt.genSaltSync()
      const passwordHash = bcrypt.hashSync(password, salt)
      // return prisma.user.create({})

      const uid = uuid()

      const user = await prisma.user.create({
        data: {
          uid,
          name,
          image,
          Credentials: {
            create: { email, passwordHash },
          },
          AuthProvider: { create: { type: AuthProviderType.CREDENTIALS } },
        },
      })
      const token = sign({ uid: user.uid }, process.env.NEXTAUTH_SECRET || '')
      return { user, token }
    }),
})
