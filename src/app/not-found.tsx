import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dog, PawPrint, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black/50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <Image className="mx-auto rounded-full" alt="apad image" src="/apad-square.png" width={128} height={128} />

        <div className="relative">
          <div className="text-9xl font-bold text-[#962649]/60 dark:text-[#962649]/40 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-4 text-slate-400">
              <PawPrint className="w-6 h-6 animate-bounce text-[#962649]" style={{ animationDelay: "0.2s" }} />
              <PawPrint className="w-8 h-8 animate-bounce text-[#962649]" style={{ animationDelay: "0.4s" }} />
              <PawPrint className="w-10 h-10 animate-bounce text-[#962649]" style={{ animationDelay: "0.6s" }} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-amber-600">
            <AlertTriangle className="w-6 h-6 text-[#962649]" />
            <h1 className="text-2xl font-semibold text-[#962649]">Página não encontrada!</h1>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
            Usamos todos os farejadores, mas essa página não foi encontrada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="text-white font-bold bg-[#962649]/80 hover:bg-[#962649]">
            <Link href="/dashboard">
              <Dog className="w-4 h-4 mr-2" />
              Retornar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}