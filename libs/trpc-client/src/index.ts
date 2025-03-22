import { AppRouter } from '@authority-trpc/trpc-server/routers'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8080/trpc',
      // headers(){
      // return{
      // authorization:  ``
      // }
      // }
    }),
  ],
})
