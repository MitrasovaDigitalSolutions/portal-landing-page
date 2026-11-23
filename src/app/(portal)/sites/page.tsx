import { redirect } from "next/navigation";

export default function SitesRedirectPage(): never {
  redirect("/users?tab=sites");
}
