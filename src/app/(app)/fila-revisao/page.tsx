import { Inbox } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export default function FilaRevisaoPage() {
  return (
    <PagePlaceholder
      titulo="Fila de Revisão"
      descricao="Menções capturadas automaticamente, aguardando aprovação humana."
      icon={Inbox}
    />
  );
}
