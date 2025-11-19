import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { coursesData, categories, Course } from "@/data/coursesData";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseDetailModal } from "@/components/courses/CourseDetailModal";
import { EnrollmentModal } from "@/components/courses/EnrollmentModal";
import { Search, Filter } from "lucide-react";

const Cursos = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const filteredCourses = coursesData.filter((course) => {
    const matchesCategory = selectedCategory === "Todas" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter === "low") matchesPrice = course.price <= 3000;
    else if (priceFilter === "medium") matchesPrice = course.price > 3000 && course.price <= 5000;
    else if (priceFilter === "high") matchesPrice = course.price > 5000;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  const handleSaibaMatch = (course: Course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  const handleEnroll = (course: Course) => {
    setShowDetailModal(false);
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Catálogo de Cursos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            50 cursos profissionais com certificado incluso. Aprenda no seu ritmo com texto, vídeo e áudio.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[250px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os preços</SelectItem>
                <SelectItem value="low">Até 3.000 Kz</SelectItem>
                <SelectItem value="medium">3.000 - 5.000 Kz</SelectItem>
                <SelectItem value="high">Acima de 5.000 Kz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
            </p>
            {(selectedCategory !== "Todas" || searchTerm || priceFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("Todas");
                  setSearchTerm("");
                  setPriceFilter("all");
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSaibaMatch={handleSaibaMatch}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Nenhum curso encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </main>

      <Footer />

      <CourseDetailModal
        course={selectedCourse}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onEnroll={handleEnroll}
      />

      <EnrollmentModal
        course={selectedCourse}
        open={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
      />
    </div>
  );
};

export default Cursos;
