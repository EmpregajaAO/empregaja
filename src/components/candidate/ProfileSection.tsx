import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Save, Upload, Download, Trash2, User } from "lucide-react";

interface ProfileSectionProps {
  candidatoId: string;
  nomeCompleto: string;
  telefone: string | null;
  onUpdate: () => void;
}

export default function ProfileSection({ candidatoId, nomeCompleto, telefone, onUpdate }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState(nomeCompleto);
  const [tel, setTel] = useState(telefone || "");
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("perfis")
        .update({ nome_completo: nome, telefone: tel })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
    }
  };

  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${candidatoId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast({
        title: "Sucesso",
        description: "Documento anexado com sucesso!",
      });
      
      // Reload documents list here if needed
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível anexar o documento",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 bg-panel-profile/30 border-panel-profile-foreground/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-panel-profile rounded-lg">
            <User className="w-6 h-6 text-panel-profile-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Meu Perfil</h2>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome Completo</Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>

        <div className="pt-4 border-t">
          <Label>Documentos e Certificados (Opcional)</Label>
          <div className="mt-2 space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={uploading}
              onClick={() => document.getElementById('doc-upload')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Enviando..." : "Anexar Documento"}
            </Button>
            <input
              id="doc-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleUploadDocument}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
