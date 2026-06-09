import { redirect } from "next/navigation";

export default function NosotrosPage() {
  redirect("/?panel=local");
}
