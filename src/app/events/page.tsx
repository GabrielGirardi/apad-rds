import AuthGuard from "@/components/auth/auth-guard";

export default function EventsPage() {
    return (
        <AuthGuard>
            Page
        </AuthGuard>
    )
}