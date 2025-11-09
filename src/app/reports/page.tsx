import AuthGuard from "@/components/auth/auth-guard";
import ReportsPageContent from "./components/content";

export default function ReportsPage() {
  return (
    <AuthGuard>
      <ReportsPageContent />
    </AuthGuard>
  )
}