import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, FileText, Video, Headphones, Image } from "lucide-react";
import { Course } from "@/data/coursesData";

interface CourseCardProps {
  course: Course;
  onSaibaMatch: (course: Course) => void;
}

const getFormatIcon = (format: string) => {
  switch (format.toLowerCase()) {
    case "texto":
      return <FileText className="h-4 w-4" />;
    case "vídeo":
      return <Video className="h-4 w-4" />;
    case "áudio":
      return <Headphones className="h-4 w-4" />;
    case "foto":
      return <Image className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export const CourseCard = ({ course, onSaibaMatch }: CourseCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <GraduationCap className="h-6 w-6 text-primary flex-shrink-0" />
          <Badge variant="secondary" className="text-xs">
            {course.category}
          </Badge>
        </div>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {course.price.toLocaleString('pt-AO')} Kz
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {course.formats.map((format, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {getFormatIcon(format)}
                <span>{format}</span>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSaibaMatch(course)}
          className="w-full"
          variant="default"
        >
          Saiba Match
        </Button>
      </CardFooter>
    </Card>
  );
};
