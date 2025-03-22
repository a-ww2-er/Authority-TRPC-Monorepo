import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
import { trpc } from '@authority-trpc/trpc-client/src'
import { sign, verify } from 'jsonwebtoken'

export const MAX_AGE = 1 * 24 * 60 * 60

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const { email, password } = credentials
        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        const data = await trpc.auth.signIn.mutate({ email, password })

        if (!data?.user) {
          throw new Error('Authentication failed')
        }

        return {
          id: data.user.uid,
          name: data.user.name,
          image: data.user.image,
          email,
        }
      },
    }),
  ],
  debug: true,
  session: {
    strategy: 'jwt',
    maxAge: MAX_AGE,
  },
  //functionslity to encode and decode jwt tokens
  jwt: {
    async encode({ token, secret }): Promise<string> {
      if (!token) {
        throw new Error('Token is undefined')
      }
      const { sub, picture, ...tokenPropss } = token
      const nowInSeconds = Math.floor(Date.now() / 1000)
      const expirationTimestamp = nowInSeconds + MAX_AGE

      return sign(
        {
          uid: sub,
          image: picture,
          ...tokenPropss,
          exp: expirationTimestamp,
        },
        secret,
        { algorithm: 'HS256' },
      )
    },
    async decode({ token, secret }): Promise<JWT | null> {
      if (!token) {
        throw new Error('Token is undefined')
      }
      try {
        const decodedToken = verify(token, secret, {
          algorithms: ['HS256'],
        })
        return decodedToken as JWT
      } catch (error) {
        console.error('JWT decode error', error)
        return null
      }
    },
  },
  //   callbacks:{
  //     //this will be called when any of the signin methods are succesful
  //     async signIn({user,account}){
  // if(account?.provider === 'google'){
  //     const {id,name,image} =
  // }
  //     }
  //   }
}
