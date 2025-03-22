'use client'
import { trpcClient } from '@authority-trpc/trpc-client/src/client'
import { userFormRegister } from '@authority-trpc/forms/src/register'
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = userFormRegister()
  console.log('errors', errors)
  const { mutateAsync } = trpcClient.auth.registerWithCredentials.useMutation()
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const user = await mutateAsync(data)
        console.log('user', user)
      })}
    >
      <input placeholder="Email" {...register('email')} />
      <input placeholder="Password" {...register('password')} />
      <input placeholder="Name" {...register('name')} />
      <button type="submit">Submit</button>
    </form>
  )
}
