//fetching with trpc server side
//the development drawback of this is that nextjs caches the data from server side
//so even if our database has a new entry..we must delete .next cache folder and restart our server
//import {trpc} from '@foundation-trpc/trpc-client/src'

// export default async function Home(){
//   const users = await trpc.auth.users.query()
//   return <main>Hello { JSON.stringify(users)}</main>
// }

export default function Home() {
  return <main>hello</main>
}
