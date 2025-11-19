import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Course } from "@/data/coursesData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Copy, Check } from "lucide-react";

interface EnrollmentModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
}

const IBAN = "AO06.0040.0000.5845.4785.1014.5";

export const EnrollmentModal = ({ course, open, onClose }: EnrollmentModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText(IBAN);
    setCopied(true);
    toast.success("IBAN copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !course) {
      toast.error("Por favor, anexe o comprovativo de pagamento");
      return;
    }

    setUploading(true);

    try {
      // Get current user and candidate
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado");
        setUploading(false);
        return;
      }

      // Get perfil
      const { data: perfil } = await supabase
        .from("perfis")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!perfil) {
        toast.error("Perfil não encontrado");
        setUploading(false);
        return;
      }

      // Get candidato
      const { data: candidato } = await supabase
        .from("candidatos")
        .select("id")
        .eq("perfil_id", perfil.id)
        .single();

      if (!candidato) {
        toast.error("Candidato não encontrado");
        setUploading(false);
        return;
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `comprovativos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('comprovativos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('comprovativos')
        .getPublicUrl(filePath);

      // Create comprovativo record
      const { data: comprovativo, error: comprovantivoError } = await supabase
        .from("comprovativos_pagamento")
        .insert({
          candidato_id: candidato.id,
          comprovativo_url: publicUrl,
          tipo_servico: `Curso: ${course.title}`,
          valor: course.price,
          status: "pendente"
        })
        .select()
        .single();

      if (comprovantivoError) throw comprovantivoError;

      // Get course from database
      const { data: dbCourse } = await supabase
        .from("courses")
        .select("id")
        .eq("title", course.title)
        .single();

      if (dbCourse) {
        // Create enrollment
        const { error: enrollmentError } = await supabase
          .from("course_enrollments")
          .insert({
            candidato_id: candidato.id,
            course_id: dbCourse.id,
            comprovativo_id: comprovativo.id,
            payment_verified: false,
            status: "pending"
          });

        if (enrollmentError) throw enrollmentError;
      }

      toast.success("Inscrição enviada! Aguarde aprovação do pagamento.");
      onClose();
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao enviar inscrição. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Inscrever-se: {course.title}</DialogTitle>
          <DialogDescription>
            Complete o pagamento e envie o comprovativo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Valor do Curso:</p>
              <p className="text-2xl font-bold text-primary">
                {course.price.toLocaleString('pt-AO')} Kz
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Inclui certificado oficial)
              </p>
            </div>

            <div className="space-y-2">
              <Label>IBAN para Transferência</Label>
              <div className="flex gap-2">
                <Input 
                  value={IBAN} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyIBAN}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                Faça a transferência bancária e anexe o comprovativo abaixo. 
                Seu pagamento será validado em até 24 horas.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="comprovativo">Comprovativo de Pagamento *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="comprovativo"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Arquivo: {file.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading} className="flex-1">
              {uploading ? "Enviando..." : "Enviar Inscrição"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
