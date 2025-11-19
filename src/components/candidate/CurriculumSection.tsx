import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CurriculumSectionProps {
  candidatoData: any;
  tipoConta: string;
}

const templates = [
  { id: "professional", name: "Profissional Clássico", description: "Layout limpo e tradicional" },
  { id: "modern", name: "Moderno", description: "Design contemporâneo e vibrante" },
  { id: "creative", name: "Criativo", description: "Estilo único e diferenciado" },
];

export default function CurriculumSection({ candidatoData, tipoConta }: CurriculumSectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    try {
      // TODO: Implement PDF generation with selected template
      toast({
        title: "Gerando Currículo",
        description: `Seu currículo no template ${templates.find(t => t.id === selectedTemplate)?.name} está sendo gerado...`,
      });
      
      // Simulate PDF generation
      setTimeout(() => {
        toast({
          title: "Sucesso!",
          description: "Seu currículo foi gerado com sucesso!",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o currículo",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 bg-panel-curriculum/30 border-panel-curriculum-foreground/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-panel-curriculum rounded-lg">
          <FileText className="w-6 h-6 text-panel-curriculum-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Currículo Personalizado</h2>
          {tipoConta === "pro" && (
            <p className="text-sm text-muted-foreground">Baixe quantas vezes quiser!</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Escolha um Template
          </Label>
          <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? "border-panel-curriculum-foreground bg-panel-curriculum/20"
                      : "border-border hover:border-panel-curriculum-foreground/50"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <RadioGroupItem value={template.id} id={template.id} />
                  <Label htmlFor={template.id} className="flex-1 cursor-pointer">
                    <p className="font-semibold">{template.name}</p>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Button 
          onClick={handleGeneratePDF}
          className="w-full bg-panel-curriculum-foreground hover:bg-panel-curriculum-foreground/90"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Gerar e Baixar Currículo PDF
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Todas as suas informações de perfil serão aplicadas automaticamente ao template escolhido.
        </p>
      </div>
    </Card>
  );
}
