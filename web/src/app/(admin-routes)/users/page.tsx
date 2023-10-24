'use client'

import * as z from "zod"
import HeaderPage from "@/components/styled/header-page";
import { Button } from "@/components/ui/button";
import { Loader, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input"
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
import { ChangeEvent, createRef, useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { isValidCPF } from "@/utils/validCpf";
import axios from 'axios';

const formSchema = z.object({
    name: z.string().min(3, {
        message: "O nome deve ter pelo menos 3 caracteres.",
    }),
    cpf: z.string().refine((value) => isValidCPF(value), {
        message: 'CPF inválido',
    }),
    password: z.string().min(8, {
        message: "A senha deve ter pelo menos 8 caracteres.",
    }),
    team_id: z.string().min(1, {
        message: "Selecione uma equipe para exibir.",
    })
})

interface Users {
    id: string
    name: string
    cpf: string
    role: number
    team_users: {
        name: string
    }
}

const Roles = [
    'Admin',
    'Líder',
    'Colaborador'
]

export default function Message() {
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [openCreate, setOpenCreate] = useState<boolean>(false)
    const { data } = useSession();
    const [loading, setLoading] = useState<boolean>(false)
    const [users, setUsers] = useState<Users[]>([]);
    const [id, setId] = useState<string>("");
    const [name, setName] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            cpf: "",
            password: "",
            team_id: ""
        },
    })


    if (data?.user.role != 0) {
        redirect('/403')
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                {
                    name: values.name,
                    cpf: values.cpf.replaceAll('.', '').replace('-', ''),
                    password: values.password,
                    team_id: parseInt(values.team_id),
                    role: 1
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },

                },
            );
            toast({
                style: { backgroundColor: '#0c6227' },
                title: "Usuário criado com sucesso!",
                description: `${values.name} , estaremos te redirecionando em instantes.`,
            })
            await getUsers();
            setLoading(false);
            setOpenCreate(false);
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Algo deu errado.",
                    description: error.response?.data.message,
                })
                console.log('error message: ', error);
            } else {
                console.log('unexpected error: ', error);
            }
        }
    }

    async function getUsers() {
        try {
            const response = await axios.get<any>(
                `${process.env.NEXT_PUBLIC_API_URL}/users`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${data?.user.token}`
                    },
                },
            );
            setUsers(response.data);
        } catch (error) {
            setUsers([]);
        }
    }

    async function onDelete() {
        setLoading(true);
        try {
            const response = await axios.delete<any>(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
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
                description: `Usuário deletada com sucesso`,
            });

            setOpenDelete
            form.reset();
            await getUsers();
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


    useEffect(() => {
        if (typeof window !== "undefined") {
            getUsers()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function inputMaskCpf(event: ChangeEvent<HTMLInputElement>): void {
        let inputCpf = event.target.value.replace(/\D/g, '');

        let formattedCpf = '';

        inputCpf = inputCpf.substring(0, 11);

        for (let i = 0; i < inputCpf.length; i++) {
            if (i === 3 || i === 6) {
                formattedCpf += '.';
            } else if (i === 9) {
                formattedCpf += '-';
            }
            formattedCpf += inputCpf[i];
        }
        event.target.value = formattedCpf;
        form.setValue("cpf", formattedCpf);
    }


    return (
        <>
            <HeaderPage title={'Cadastro de Usuários'}></HeaderPage>
            <div className="flex flex-row justify-between m-3">
                <Sheet open={openCreate} onOpenChange={setOpenCreate}>
                    <SheetTrigger asChild>
                        <Button onClick={() => { form.setValue("cpf", "") }}>
                            <Plus className="mr-2 h-4 w-4" /> Adicionar
                        </Button>
                    </SheetTrigger>
                    <SheetContent >
                        <SheetHeader>
                            <SheetTitle>Adicionar Lider</SheetTitle>
                            <SheetDescription>
                                Após preencher as informações clique em salvar
                            </SheetDescription>
                        </SheetHeader>
                        <Separator className="my-4" />
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Nome" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cpf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="CPF" onChange={inputMaskCpf} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="password" placeholder="Senha" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="team_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma equipe para exibir" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Beta</SelectItem>
                                                    <SelectItem value="2">Ômega</SelectItem>
                                                    <SelectItem value="3">Gama</SelectItem>
                                                    <SelectItem value="4">Delta</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                        : 'Registrar'
                                    }
                                </Button>
                            </form>
                        </Form>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex flex-col mt-8 mr-3 ml-3">
                <Table>
                    <TableCaption>Uma lista de usuários.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Acesso</TableHead>
                            <TableHead>Equipe</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.cpf}</TableCell>
                                <TableCell>{Roles[user.role]}</TableCell>
                                <TableCell>{user.team_users ? user.team_users.name : 'ADM'}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-row gap-2 justify-end" >
                                        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                                            <DialogTrigger asChild>
                                                <Button onClick={() => { setId(user.id); setName(user.name) }} variant="outline" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Inativando Usuário</DialogTitle>
                                                    <DialogDescription>
                                                        Você deseja inativar o(a) {name}?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter className="sm:justify-around gap-2">
                                                    <Button variant={"destructive"} onClick={onDelete} disabled={loading} className="w-full">
                                                        {loading ?
                                                            <>
                                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                                Carregando
                                                            </>
                                                            : 'Inativar'
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