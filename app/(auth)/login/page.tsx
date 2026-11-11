import { redirect } from "next/navigation";

/** Redirect legacy `/login` URL requests to the default root `/` login page. */
export default function LoginRedirectPage() {
  redirect("/");
}
