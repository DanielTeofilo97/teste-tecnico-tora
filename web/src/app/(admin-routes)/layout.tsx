import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Toaster } from "@/components/ui/toaster";

interface PrivateLayoutProps {
	children: ReactNode
}

export default async function PrivateLayout({ children }: PrivateLayoutProps){
	const session = await getServerSession(nextAuthOptions)

	if (!session) {
		redirect('/')
	}

	return (
		<div className="flex h-full flex-col">
			<Header />
			    <div className="flex-1">{children}</div>
			<Footer />
	    </div>
	)
}