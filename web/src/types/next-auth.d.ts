import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			name: string
			team_id : number
			role : number
			team_users : {
				name:string
			}
			token:string
		}
	}
}