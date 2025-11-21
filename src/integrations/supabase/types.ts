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
          portfolio_url: string | null
          pretensao_salarial: number | null
          provincia: string | null
          telefone: string | null
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
          portfolio_url?: string | null
          pretensao_salarial?: number | null
          provincia?: string | null
          telefone?: string | null
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
          portfolio_url?: string | null
          pretensao_salarial?: number | null
          provincia?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string
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
          telefone: string | null
          tipo_conta: string | null
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
          telefone?: string | null
          tipo_conta?: string | null
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
          telefone?: string | null
          tipo_conta?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
