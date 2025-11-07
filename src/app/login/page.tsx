import Image from "next/image";
import { Cat, Dog } from "lucide-react";

import NoAuthGuard from "@/components/auth/no-auth-guard";
import ButtonThemeToggler from "@/components/theme/button";
import {
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";

import { LoginForm } from "./components/login-form";

export default function Login() {
  return (
    <NoAuthGuard>
      <div className="flex flex-wrap h-screen w-full relative md:grid md:grid-cols-2">
        <div className="relative w-full h-2/5 md:h-full bg-gradient-to-tl from-[#962649] to-black p-12">
          <h1 className="text-white text-xl font-bold uppercase">
            <Image alt="logo apad" src="/logo-apad.png" width={118} height={134} />
          </h1>
          <div className="flex justify-center w-full absolute bottom-0 left-1/2 transform -translate-x-1/2 [mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)]">
            <Image alt="logo apad" src="/apad-login.png" width={768} height={420} />
          </div>
        </div>
        <div className="flex flex-col gap-6 items-center justify-center bg-muted w-full h-3/5 md:h-full md:p-0 transition-colors">
          <div className="flex items-center justify-center space-x-4 text-slate-400 p-2 bg-[#962649]/20 md:rounded-md w-full max-w-md">
            <Dog className="w-10 h-10 text-[#962649]" />
            <h2 className="font-bold text-2xl text-[#962649] uppercase">Abrigo digital</h2>
            <Cat className="w-10 h-10 text-[#962649]" />
          </div>
          <Card className="w-full h-full rounded-none md:rounded-lg md:h-auto md:max-w-md space-y-6 border-transparent bg-muted shadow-none md:border md:border-[#962649] transition-colors">
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Entrar na sua conta</h2>
              <ButtonThemeToggler />
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </NoAuthGuard>
  );
}