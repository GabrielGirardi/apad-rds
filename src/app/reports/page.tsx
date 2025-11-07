import AuthGuard from "@/components/auth/auth-guard";

export default function ReportsPage() {
    return (
        <AuthGuard>
            Page
        </AuthGuard>
    )
}