import { DatabaseBackup } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export default function BackupPage() {
  return (
    <PagePlaceholder
      titulo="Backup"
      descricao="Exportar e restaurar o banco de dados e os anexos."
      icon={DatabaseBackup}
    />
  );
}
