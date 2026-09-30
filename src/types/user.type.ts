import { CompanyRole } from "./company.type";
export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: CompanyRole;
  companyId: string;
  company?: Company;
  status?: string;
}
export type UserRole = "ADMIN" | "PROJECT_MANAGER" | "ENGINEER" | "WORKER";
