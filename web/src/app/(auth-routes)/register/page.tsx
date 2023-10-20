'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react";
import { isValidCPF } from "@/utils/validCpf";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import InputMask from 'react-input-mask';
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
    team_id: z.string().min(1,{
            message: "Selecione uma equipe para exibir.",
        })
})



export default function Home() {
    const router = useRouter()
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            cpf: "",
            password: "",
            team_id: ""
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:3001/auth/register',
                {
                    name: values.name,
                    cpf: values.cpf.replaceAll('.', '').replace('-', ''),
                    password: values.password,
                    team_id: parseInt(values.team_id),
                    role: 2
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
            const result = await signIn('credentials', {
                cpf: values.cpf.replaceAll('.', '').replace('-', ''),
                password: values.password,
                redirect: false
            })
            setLoading(false);
            if (result?.error) {
                const json_data = JSON.parse(result.error);
                toast({
                    variant: "destructive",
                    title: "Uh oh! Algo deu errado.",
                    description: Array.isArray(json_data.errors.message) ? json_data.errors.message[0] : json_data.errors.message,
                })
                return
            }
            router.replace('/admin')
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

    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', margin: '30px auto', padding: '0px 10px 0px 10px', justifyContent: 'center', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
                <p style={{ fontSize: '30px' }} className="text-lg font-semibold">
                    <span className="text-primary">FJ</span> Company
                </p>
            </div>
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
                                    <InputMask mask="999.999.999-99" maskChar={null} value={field.value} onChange={field.onChange}>
                                        {(inputProps: any) => <Input placeholder="CPF" {...inputProps} />}
                                    </InputMask>
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
            <Separator className="my-4" />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link href="/">
                    <p className="text-sm font-semibold">
                        Já sou cadastrado
                    </p>
                </Link>
            </div>
        </div>
    )
}
