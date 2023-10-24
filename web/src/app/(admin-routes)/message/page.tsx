'use client'

import * as z from "zod"
import HeaderPage from "@/components/styled/header-page";
import { Button } from "@/components/ui/button";
import { Loader, Pencil, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import { createRef, useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const formSchema = z.object({
	message: z.string().min(8, {
		message: "A mensagem deve ter pelo menos 8 caracteres.",
	}),
})

interface Message {
	createdAt: string
	id: string
	message: string
	team_id: number
	updatedAt: string
}

export default function Message() {
	const [openDelete, setOpenDelete] = useState<boolean>(false)
	const [openCreate, setOpenCreate] = useState<boolean>(false)
	const [openEdit, setOpenEdit] = useState<boolean>(false)
	const { data } = useSession();
	const [loading, setLoading] = useState<boolean>(false)
	const [message, setMessage] = useState<Message[]>([]);
	const [id, setId] = useState<string>("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: "",
		},
	})

	if (data?.user.role != 1) {
		redirect('/403')
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			const response = await axios.post<any>(
				`${process.env.NEXT_PUBLIC_API_URL}/messages`,
				{
					message: values.message
				},
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${data?.user.token}`
					},
				},
			);
			toast({
				style: { backgroundColor: '#0c6227' },
				title: "Registro Inserido",
				description: `Mensagem criada com sucesso`,
			});
			form.reset();
			await getMessages();
			setLoading(false);
			setOpenCreate(false);
		} catch (error) {
			setLoading(false);
			if (axios.isAxiosError(error)) {
				toast({
					variant: "destructive",
					title: "Uh oh! Algo deu errado.",
					description: "Nenhuma mensagem cadastrada",
				})
			}
		}
	}

	async function getMessages() {
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
			setMessage(response.data);
		} catch (error) {
			setMessage([]);
		}
	}

	async function onDelete() {
		setLoading(true);
		try {
			const response = await axios.delete<any>(
				`${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`,
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${data?.user.token}`
					},
				},
			);
			toast({
				style: { backgroundColor: '#0c6227' },
				title: "Registro Deletado",
				description: `Mensagem deletada com sucesso`,
			});
			
			setOpenDelete
			form.reset();
			await getMessages();
			setLoading(false);
			setOpenDelete(false);
		} catch (error) {
			setLoading(false);
			if (axios.isAxiosError(error)) {
				toast({
					variant: "destructive",
					title: "Uh oh! Algo deu errado.",
					description: error.response?.data.message,
				})
			}
		}
	}

	async function onEdit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			const response = await axios.patch<any>(
				`${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`,
				{
					message: values.message
				},
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${data?.user.token}`
					},
				},
			);
			toast({
				style: { backgroundColor: '#0c6227' },
				title: "Registro Editado",
				description: `Mensagem editada com sucesso`,
			});
			form.reset();
			await getMessages();
			setLoading(false);
			setOpenEdit(false);
		} catch (error) {
			setLoading(false);
			if (axios.isAxiosError(error)) {
				toast({
					variant: "destructive",
					title: "Uh oh! Algo deu errado.",
					description: error.response?.data.message,
				})
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
		<>
			<HeaderPage title={'Cadastro de Mensagens'}></HeaderPage>
			<div className="flex flex-row justify-between m-3">
				<Sheet open={openCreate} onOpenChange={setOpenCreate}>
					<SheetTrigger asChild>
						<Button onClick={() => { form.setValue("message", "") }}>
							<Plus className="mr-2 h-4 w-4" /> Adicionar
						</Button>
					</SheetTrigger>
					<SheetContent >
						<SheetHeader>
							<SheetTitle>Adicionar Mensagem</SheetTitle>
							<SheetDescription>
								Após escrever sua mensagem clique em salvar
							</SheetDescription>
						</SheetHeader>
						<Separator className="my-4" />
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
								<FormField
									control={form.control}
									name="message"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Textarea placeholder="Digite sua mensagem" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button disabled={loading} style={{ width: '100%' }}>
									{loading ?
										<>
											<Loader className="mr-2 h-4 w-4 animate-spin" />
											Carregando
										</>
										: 'Salvar'
									}
								</Button>
							</form>
						</Form>
					</SheetContent>
				</Sheet>
			</div>
			<div className="flex flex-col mt-8 mr-3 ml-3">
				<Table>
					<TableCaption>Uma lista de suas mensagens.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Mensagem</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{message.map((message, index) => (
							<TableRow key={index}>
								<TableCell>{message.message}</TableCell>
								<TableCell className="text-right">
									<div className="flex flex-row gap-2 justify-end" >
										<Sheet open={openEdit} onOpenChange={setOpenEdit}>
											<SheetTrigger asChild>
												<Button onClick={() => { form.setValue("message", message.message); setId(message.id) }} variant="outline" size="icon">
													<Pencil className="h-4 w-4" />
												</Button>
											</SheetTrigger>
											<SheetContent>
												<SheetHeader>
													<SheetTitle>Editando Mensagem | {index + 1}</SheetTitle>
													<SheetDescription>
														Após editar sua mensagem clique em salvar
													</SheetDescription>
												</SheetHeader>
												<Separator className="my-4" />
												<Form {...form}>
													<form onSubmit={form.handleSubmit(onEdit)} className="space-y-6">
														<FormField
															control={form.control}
															name="message"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Textarea placeholder="Digite sua mensagem" {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<Button disabled={loading} style={{ width: '100%' }}>
															{loading ?
																<>
																	<Loader className="mr-2 h-4 w-4 animate-spin" />
																	Carregando
																</>
																: 'Salvar'
															}
														</Button>
													</form>
												</Form>
											</SheetContent>
										</Sheet>
										<Dialog open={openDelete} onOpenChange={setOpenDelete}>
											<DialogTrigger asChild>
												<Button onClick={() => { setId(message.id) }} variant="outline" size="icon">
													<Trash2 className="h-4 w-4" />
												</Button>
											</DialogTrigger>
											<DialogContent className="sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle>Deletando Mensagem | {index + 1}</DialogTitle>
													<DialogDescription>
														Você deseja deletar a mensagem?
													</DialogDescription>
												</DialogHeader>
												<DialogFooter className="sm:justify-around gap-2">
													<Button variant={"destructive"} onClick={onDelete} disabled={loading} className="w-full">
														{loading ?
															<>
																<Loader className="mr-2 h-4 w-4 animate-spin" />
																Carregando
															</>
															: 'Deletar'
														}
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	)
}