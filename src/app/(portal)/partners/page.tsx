import { redirect } from "next/navigation";

export default function PartnersRedirectPage(): never {
  redirect("/showcase?tab=partners");
}
