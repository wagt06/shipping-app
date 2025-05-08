import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import DashboardTabs from "@/components/dashboard-tabs"

export default async function Dashboard() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Fetch user shipments
  const { data: shipments } = await supabase
    .from("shipments")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  // Fetch user addresses
  const { data: addresses } = await supabase.from("addresses").select("*").eq("user_id", session.user.id)

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Welcome, {profile?.name || "User"}</h1>
      <DashboardTabs profile={profile || {}} shipments={shipments || []} addresses={addresses || []} />
    </div>
  )
}
