import { redirect } from "next/navigation";
// /requests/[id] is not a standalone route in this MVP — requests are managed from the inbox.
export default function RequestDetailPage() {
  redirect("/requests");
}
