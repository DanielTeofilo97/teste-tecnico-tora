'use client'

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { MessageCircle } from "lucide-react";


interface Message {
	createdAt: string
	id: string
	message: string
	team_id: number
	updatedAt: string
}


export default function MessageTeam() {
	const { data } = useSession();
	const [load, setLoad] = useState<boolean>(false);
	const [message, setMessage] = useState<Message[]>([]);

	if (data?.user.role != 2) {
		redirect('/403')
	}

	async function getMessages() {
		setLoad(false);
		try {
			const response = await axios.get<any>(
				`${process.env.NEXT_PUBLIC_API_URL}/messages`,
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${data?.user.token}`
					},
				},
			);
			console.log(response.data)
			setMessage(response.data);
			setLoad(true);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setLoad(false);
				toast({
					variant: "destructive",
					title: "Uh oh! Algo deu errado.",
					description: error.response?.data.message,
				})
			} else {
				setLoad(false);
			}
		}
	}


	useEffect(() => {
		if (typeof window !== "undefined") {
			getMessages()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])


	return (
		<div style={{ display: 'flex', flexDirection: 'column', margin: '30px auto', padding: '0px 10px 0px 10px', justifyContent: 'center', maxWidth: '600px' }}>
			<Card style={{marginBottom:'10px'}}>
				<CardHeader>
					<CardTitle>Mensagens da Equipe</CardTitle>
				</CardHeader>
			</Card>
			{load ?
				<>
					{message.map((message, index) => (
						<Card key={index} style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px', padding: '10px' }}>
							<MessageCircle size={30} style={{ paddingRight: '10px' }} />
							<p style={{ paddingTop: '3px' }}>
								{message.message}
							</p>
						</Card>
					))}
				</>
				: <></>
			}
		</div>
	)
}