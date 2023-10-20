"use client";

import {
  Dices,
  HomeIcon,
  ListOrderedIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  MessageSquare,
  MessageSquarePlus,
  PercentIcon,
  ShoppingCartIcon,
  UserPlus2,
} from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "./sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "./separator";
import Link from "next/link";

const Header = () => {
  const { status, data } = useSession();

  const handleLoginClick = async () => {
    await signIn();
  };

  const handleLogoutClick = async () => {
    await signOut();
  };

  return (
    <Card className="flex items-center justify-between p-[1.875rem]">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <SheetHeader className="text-left text-lg font-semibold">
            Menu
          </SheetHeader>

          {status === "authenticated" && data?.user && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 py-4">
                <div className="flex flex-col">
                  <p className="font-medium">{data.user.name}</p>
                  {data.user.role != 0 ?
                    <p className="text-sm opacity-75"> Equipe : {data.user.team_users.name}</p> :
                    <p className="text-sm opacity-75"> Administrador</p>}
                </div>
              </div>

              <Separator />
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2">
            {status === "unauthenticated" && (
              <Button
                onClick={handleLoginClick}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <LogInIcon size={16} />
                Fazer Login
              </Button>
            )}

            {status === "authenticated" && (
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <LogOutIcon size={16} />
                Fazer Logout
              </Button>
            )}

            {data?.user.role == 2 ?
              <SheetClose asChild>
                <Link href="/catalog">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Dices size={20} />
                    Mensagens Aleatórias
                  </Button>
                </Link>
              </SheetClose>
              : <></>
            }

            {data?.user.role == 2 ?
              <SheetClose asChild>
                <Link href="/catalog">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare size={20} />
                    Mensagens da Equipe
                  </Button>
                </Link>
              </SheetClose>
              : <></>
            }

            {data?.user.role == 2 ?
              <SheetClose asChild>
                <Link href="/catalog">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquarePlus size={20} />
                    Cadastro de Mensagens
                  </Button>
                </Link>
              </SheetClose>
              : <></>
            }

            {data?.user.role == 2 ?
              <SheetClose asChild>
                <Link href="/catalog">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <UserPlus2 size={20} />
                    Usuários
                  </Button>
                </Link>
              </SheetClose>
              : <></>

            }

          </div>
        </SheetContent>
      </Sheet>

      <Link href="/">
        <h1 className="text-lg font-semibold">
          <span className="text-primary">FJ</span> Company
        </h1>
      </Link>

      <Avatar>
        <AvatarFallback>
          {data?.user.name?.[0].toUpperCase()}
        </AvatarFallback>

        {data?.user && <AvatarImage src={`https://ui-avatars.com/api/?name=${data.user.name}`} />}
      </Avatar>
    </Card>
  );
};

export default Header;
