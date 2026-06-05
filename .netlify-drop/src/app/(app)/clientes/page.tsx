import { Building2 } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export default function ClientesPage() {
  return (
    <PagePlaceholder
      titulo="Clientes"
      descricao="Cadastro dos clientes da TACO monitorados na mídia."
      icon={Building2}
    />
  );
}
