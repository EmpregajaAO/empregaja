export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessment_attempts: {
        Row: {
          answers: Json | null
          assessment_id: string
          completed_at: string | null
          enrollment_id: string
          id: string
          passed: boolean | null
          score: number | null
          started_at: string | null
        }
        Insert: {
          answers?: Json | null
          assessment_id: string
          completed_at?: string | null
          enrollment_id: string
          id?: string
          passed?: boolean | null
          score?: number | null
          started_at?: string | null
        }
        Update: {
          answers?: Json | null
          assessment_id?: string
          completed_at?: string | null
          enrollment_id?: string
          id?: string
          passed?: boolean | null
          score?: number | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "course_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_attempts_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          correct_answer: string | null
          created_at: string | null
          id: string
          options: Json | null
          order_number: number
          points: number | null
          question_text: string
          question_type: string
        }
        Insert: {
          assessment_id: string
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          order_number: number
          points?: number | null
          question_text: string
          question_type: string
        }
        Update: {
          assessment_id?: string
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          order_number?: number
          points?: number | null
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "course_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      candidatos: {
        Row: {
          area_interesse: string[] | null
          carta_apresentacao: string | null
          certificacoes: string[] | null
          cidade: string | null
          created_at: string | null
          cv_url: string | null
          data_nascimento: string | null
          disponibilidade: string | null
          email: string
          experiencia_anos: number | null
          genero: string | null
          habilidades: string[] | null
          id: string
          idiomas: string[] | null
          linkedin_url: string | null
          nivel_educacao: string | null
          nome_completo: string
          perfil_id: string | null
          portfolio_url: string | null
          pretensao_salarial: number | null
          provincia: string | null
          status_validacao: string | null
          telefone: string | null
          tipo_conta: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          area_interesse?: string[] | null
          carta_apresentacao?: string | null
          certificacoes?: string[] | null
          cidade?: string | null
          created_at?: string | null
          cv_url?: string | null
          data_nascimento?: string | null
          disponibilidade?: string | null
          email: string
          experiencia_anos?: number | null
          genero?: string | null
          habilidades?: string[] | null
          id?: string
          idiomas?: string[] | null
          linkedin_url?: string | null
          nivel_educacao?: string | null
          nome_completo: string
          perfil_id?: string | null
          portfolio_url?: string | null
          pretensao_salarial?: number | null
          provincia?: string | null
          status_validacao?: string | null
          telefone?: string | null
          tipo_conta?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          area_interesse?: string[] | null
          carta_apresentacao?: string | null
          certificacoes?: string[] | null
          cidade?: string | null
          created_at?: string | null
          cv_url?: string | null
          data_nascimento?: string | null
          disponibilidade?: string | null
          email?: string
          experiencia_anos?: number | null
          genero?: string | null
          habilidades?: string[] | null
          id?: string
          idiomas?: string[] | null
          linkedin_url?: string | null
          nivel_educacao?: string | null
          nome_completo?: string
          perfil_id?: string | null
          portfolio_url?: string | null
          pretensao_salarial?: number | null
          provincia?: string | null
          status_validacao?: string | null
          telefone?: string | null
          tipo_conta?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidatos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      comprovativos_pagamento: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          candidato_id: string
          comprovativo_url: string
          created_at: string | null
          dados_ocr: Json | null
          id: string
          observacoes: string | null
          status: string | null
          tipo_servico: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          candidato_id: string
          comprovativo_url: string
          created_at?: string | null
          dados_ocr?: Json | null
          id?: string
          observacoes?: string | null
          status?: string | null
          tipo_servico: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          candidato_id?: string
          comprovativo_url?: string
          created_at?: string | null
          dados_ocr?: Json | null
          id?: string
          observacoes?: string | null
          status?: string | null
          tipo_servico?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "comprovativos_pagamento_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
        ]
      }
      course_assessments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          module_id: string
          passing_score: number | null
          time_limit_minutes: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_id: string
          passing_score?: number | null
          time_limit_minutes?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_id?: string
          passing_score?: number | null
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_assessments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          audio_url: string | null
          content_text: string | null
          content_type: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          is_preview: boolean | null
          module_id: string
          order_number: number
          pdf_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          content_text?: string | null
          content_type: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_preview?: boolean | null
          module_id: string
          order_number: number
          pdf_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          content_text?: string | null
          content_type?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_preview?: boolean | null
          module_id?: string
          order_number?: number
          pdf_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_locked: boolean | null
          order_number: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_locked?: boolean | null
          order_number: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_locked?: boolean | null
          order_number?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          duration_hours: number | null
          id: string
          instructor: string | null
          is_active: boolean | null
          level: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor?: string | null
          is_active?: boolean | null
          level?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor?: string | null
          is_active?: boolean | null
          level?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      empregadores: {
        Row: {
          created_at: string | null
          descricao_empresa: string | null
          email_empresa: string
          id: string
          localizacao: string | null
          logo_url: string | null
          nome_empresa: string
          numero_funcionarios: string | null
          provincia: string | null
          setor_atividade: string | null
          telefone_empresa: string | null
          tipo_conta: string | null
          updated_at: string | null
          user_id: string
          verificado: boolean | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          descricao_empresa?: string | null
          email_empresa: string
          id?: string
          localizacao?: string | null
          logo_url?: string | null
          nome_empresa: string
          numero_funcionarios?: string | null
          provincia?: string | null
          setor_atividade?: string | null
          telefone_empresa?: string | null
          tipo_conta?: string | null
          updated_at?: string | null
          user_id: string
          verificado?: boolean | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          descricao_empresa?: string | null
          email_empresa?: string
          id?: string
          localizacao?: string | null
          logo_url?: string | null
          nome_empresa?: string
          numero_funcionarios?: string | null
          provincia?: string | null
          setor_atividade?: string | null
          telefone_empresa?: string | null
          tipo_conta?: string | null
          updated_at?: string | null
          user_id?: string
          verificado?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      entrevistas: {
        Row: {
          candidato_id: string
          created_at: string | null
          data_entrevista: string | null
          empregador_id: string
          id: string
          local_ou_link: string | null
          observacoes: string | null
          status: string | null
          tipo_entrevista: string | null
          updated_at: string | null
          vaga_id: string | null
        }
        Insert: {
          candidato_id: string
          created_at?: string | null
          data_entrevista?: string | null
          empregador_id: string
          id?: string
          local_ou_link?: string | null
          observacoes?: string | null
          status?: string | null
          tipo_entrevista?: string | null
          updated_at?: string | null
          vaga_id?: string | null
        }
        Update: {
          candidato_id?: string
          created_at?: string | null
          data_entrevista?: string | null
          empregador_id?: string
          id?: string
          local_ou_link?: string | null
          observacoes?: string | null
          status?: string | null
          tipo_entrevista?: string | null
          updated_at?: string | null
          vaga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevistas_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrevistas_empregador_id_fkey"
            columns: ["empregador_id"]
            isOneToOne: false
            referencedRelation: "empregadores"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          ativo: boolean | null
          cargo: string
          created_at: string | null
          data_admissao: string
          id: string
          perfil_id: string
          salario_base: number
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo: string
          created_at?: string | null
          data_admissao: string
          id?: string
          perfil_id: string
          salario_base: number
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string
          created_at?: string | null
          data_admissao?: string
          id?: string
          perfil_id?: string
          salario_base?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          enrollment_id: string
          id: string
          lesson_id: string
          time_spent_minutes: number | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          enrollment_id: string
          id?: string
          lesson_id: string
          time_spent_minutes?: number | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          enrollment_id?: string
          id?: string
          lesson_id?: string
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes_push: {
        Row: {
          created_at: string | null
          id: string
          lida: boolean | null
          mensagem: string
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lida?: boolean | null
          mensagem: string
          tipo: string
          titulo: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lida?: boolean | null
          mensagem?: string
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      perfis: {
        Row: {
          avatar_url: string | null
          cidade: string | null
          created_at: string | null
          data_nascimento: string | null
          disponibilidade: string | null
          email: string | null
          genero: string | null
          id: string
          linkedin_url: string | null
          nome_completo: string | null
          portfolio_url: string | null
          provincia: string | null
          sobre_mim: string | null
          status_validacao: string | null
          telefone: string | null
          tipo_conta: string | null
          tipo_utilizador: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cidade?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          disponibilidade?: string | null
          email?: string | null
          genero?: string | null
          id: string
          linkedin_url?: string | null
          nome_completo?: string | null
          portfolio_url?: string | null
          provincia?: string | null
          sobre_mim?: string | null
          status_validacao?: string | null
          telefone?: string | null
          tipo_conta?: string | null
          tipo_utilizador?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cidade?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          disponibilidade?: string | null
          email?: string | null
          genero?: string | null
          id?: string
          linkedin_url?: string | null
          nome_completo?: string | null
          portfolio_url?: string | null
          provincia?: string | null
          sobre_mim?: string | null
          status_validacao?: string | null
          telefone?: string | null
          tipo_conta?: string | null
          tipo_utilizador?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string | null
          id: string
          payment_verified: boolean | null
          progress_percentage: number | null
          status: string | null
          student_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          payment_verified?: boolean | null
          progress_percentage?: number | null
          status?: string | null
          student_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          payment_verified?: boolean | null
          progress_percentage?: number | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_interview_with_employer: {
        Args: { _candidato_user_id: string; _empregador_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "candidato"
        | "empregador"
        | "funcionario"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "candidato",
        "empregador",
        "funcionario",
      ],
    },
  },
} as const
