
import { DashboardLayout } from "@/components/layout/public/Dashboard-layout";



export default async function Layout({ children }: { children: React.ReactNode }) {


  return <DashboardLayout>{children}</DashboardLayout>;
}
