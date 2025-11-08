import AuthGuard from "@/components/auth/auth-guard";
import EventsContent from "./components/content";

export default function EventsPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto md:py-8 text-gray-500 p-4 md:p-0">
        <div className="flex justify-between items-center mb-8 bg-muted p-2 rounded-md">
          <div>
            <h1 className="text-lg font-bold dark:text-gray-200">Eventos</h1>
          </div>
        </div>
        <EventsContent />
      </div>
    </AuthGuard>
  )
}