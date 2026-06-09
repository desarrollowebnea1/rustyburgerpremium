import { ok } from "@/lib/api-response";
import { clearAdminSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = ok({ loggedOut: true });
  clearAdminSessionCookie(response);
  return response;
}
