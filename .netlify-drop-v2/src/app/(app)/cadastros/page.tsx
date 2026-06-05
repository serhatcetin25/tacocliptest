import { Settings } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export default function CadastrosPage() {
  return (
    <PagePlaceholder
      titulo="Cadastros"
      descricao="Veículos, editorias e tags reutilizáveis."
      icon={Settings}
    />
  );
}
