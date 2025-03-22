import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from '@authority-trpc/trpc-server/routers'

export const trpcClient = createTRPCReact<AppRouter>()
