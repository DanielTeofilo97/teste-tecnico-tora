import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"


export default async function Admin(){
	const session = await getServerSession(nextAuthOptions)
	
	return (
		<div className="flex flex-col gap-8 py-8 items-center justify-center">
			<h1 className="text-2xl mb-8">Olá, {session?.user.name}. Bem vindo(a)!</h1>
		</div>
	)
}