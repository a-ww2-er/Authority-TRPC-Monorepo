'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { formSchemaSignin } from './schema'
// import { schemaSignin } from './schemas'

export type FormTypeSignin = z.infer<typeof formSchemaSignin>

export const userFormSignin = () =>
  useForm<FormTypeSignin>({
    resolver: zodResolver(formSchemaSignin),
  })
