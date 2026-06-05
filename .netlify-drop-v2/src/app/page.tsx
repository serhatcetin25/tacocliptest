import { redirect } from "next/navigation";

// Raiz redireciona para o dashboard (que, com auth, exigirá login).
export default function Home() {
  redirect("/clipagens");
}
