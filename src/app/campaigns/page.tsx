import AuthGuard from "@/components/auth/auth-guard";

export default function CampaignsPage() {
    return (
        <AuthGuard>
            Page
        </AuthGuard>
    )
}