'use client'

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useSession } from "next-auth/react";
import axios from "axios";
import { redirect } from "next/navigation";
import Image from 'next/image'
import { Dice5, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator";

interface Message {
	en: string,
	pt: string
}

export default function MessageRandom() {
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMessage, setHasMessage] = useState<boolean>(false);
	const [message, setMessage] = useState<Message>();
	const [className, setClassName] = useState(''); 
	const { data } = useSession();

	if (data?.user.role != 2) {
		redirect('/403')
	}


	async function getRandomMessage() {
		setClassName('animate-spin');
		setLoading(true);
		setHasMessage(false);
		try {
			const response = await axios.get<any>(
				'http://localhost:3001/messages/random',
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${data?.user.token}`
					},
				},
			);
			setMessage(response.data.message);
			setLoading(false);
			setClassName('');
			setHasMessage(true);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setClassName('');
				setLoading(false);
				toast({
					variant: "destructive",
					title: "Uh oh! Algo deu errado.",
					description: error.response?.data.message,
				})
			} else {
				setClassName('');
				setLoading(false);
			}
		}
	}

		useEffect(() => {
		if (typeof window !== "undefined") {
			getRandomMessage()
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}}, [])


	return (
		<div style={{ display: 'flex', height: '60vh', flexDirection: 'column', margin: '30px auto', padding: '0px 10px 0px 10px', justifyContent: 'center', maxWidth: '600px' }}>
			<Card>
				<CardHeader>
					<CardTitle>Mensagem Aleátoria</CardTitle>
					<CardDescription>
						Clique no botão abaixo para gerar uma mensagem
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center">
					{!hasMessage ?
						<>
							<Dice5 size={50} className={className} /></>
						:
						<div>
							<Card>
								<CardContent>
									<div className="flex flex-col mt-6 justify-center items-center">
										<Image src="/en.png" alt="me" width="32" height="32" />
										<p style={{ paddingTop: '5px' }}>
											{message?.en}
										</p>
									</div>

									<Separator className="my-4" />
									<div className="flex flex-col justify-center items-center">
										<Image src="/pt.png" alt="me" width="32" height="32" />
										<p style={{ paddingTop: '5px' }}>
											{message?.pt}
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					}
				</CardContent>
				<CardFooter>
					<Button onClick={getRandomMessage} disabled={loading} style={{ width: '100%' }}>
						{loading ?
							<>
								<Loader className="mr-2 h-4 w-4 animate-spin" />
								Carregando
							</>
							: 'Gerar Mensagem'
						}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}