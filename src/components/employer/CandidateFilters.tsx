import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface CandidateFiltersProps {
  onFilter: (filters: any) => void;
}

const CandidateFilters = ({ onFilter }: CandidateFiltersProps) => {
  const [formacao, setFormacao] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [tipoPerfil, setTipoPerfil] = useState("todos");

  const handleFilter = () => {
    onFilter({
      formacao,
      localidade,
      tipoPerfil,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros Avançados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Formação/Curso</label>
            <Input
              placeholder="Ex: Engenharia"
              value={formacao}
              onChange={(e) => setFormacao(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Localidade</label>
            <Input
              placeholder="Ex: Luanda"
              value={localidade}
              onChange={(e) => setLocalidade(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Perfil</label>
            <Select value={tipoPerfil} onValueChange={setTipoPerfil}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pro">Recomendados</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="basico">Básicos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleFilter} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateFilters;
