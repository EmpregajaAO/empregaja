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
          created_at: string | null
          cv_url: string | null
          data_expiracao_conta: string | null
          id: string
          numero_candidato: string
          perfil_id: string
          tipo_conta: Database["public"]["Enums"]["tipo_conta_candidato"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cv_url?: string | null
          data_expiracao_conta?: string | null
          id?: string
          numero_candidato: string
          perfil_id: string
          tipo_conta?:
            | Database["public"]["Enums"]["tipo_conta_candidato"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cv_url?: string | null
          data_expiracao_conta?: string | null
          id?: string
          numero_candidato?: string
          perfil_id?: string
          tipo_conta?:
            | Database["public"]["Enums"]["tipo_conta_candidato"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidatos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          candidato_id: string
          created_at: string | null
          empregador_id: string
          id: string
          iniciado_por_empregador: boolean | null
          updated_at: string | null
        }
        Insert: {
          candidato_id: string
          created_at?: string | null
          empregador_id: string
          id?: string
          iniciado_por_empregador?: boolean | null
          updated_at?: string | null
        }
        Update: {
          candidato_id?: string
          created_at?: string | null
          empregador_id?: string
          id?: string
          iniciado_por_empregador?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_empregador_id_fkey"
            columns: ["empregador_id"]
            isOneToOne: false
            referencedRelation: "empregadores"
            referencedColumns: ["id"]
          },
        ]
      }
      comprovativos_pagamento: {
        Row: {
          candidato_id: string
          comprovativo_url: string
          created_at: string | null
          dados_ocr: Json | null
          id: string
          observacoes: string | null
          status: Database["public"]["Enums"]["status_pagamento"] | null
          tipo_servico: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          candidato_id: string
          comprovativo_url: string
          created_at?: string | null
          dados_ocr?: Json | null
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_pagamento"] | null
          tipo_servico: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          candidato_id?: string
          comprovativo_url?: string
          created_at?: string | null
          dados_ocr?: Json | null
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_pagamento"] | null
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
      empregadores: {
        Row: {
          created_at: string | null
          id: string
          nome_empresa: string
          perfil_id: string
          ramo_atuacao: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome_empresa: string
          perfil_id: string
          ramo_atuacao: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome_empresa?: string
          perfil_id?: string
          ramo_atuacao?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empregadores_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      entrevistas: {
        Row: {
          candidato_id: string
          created_at: string | null
          data_hora: string
          empregador_id: string
          id: string
          local_ou_link: string | null
          notas: string | null
          status: Database["public"]["Enums"]["status_entrevista"] | null
          tipo: Database["public"]["Enums"]["tipo_entrevista"]
          updated_at: string | null
        }
        Insert: {
          candidato_id: string
          created_at?: string | null
          data_hora: string
          empregador_id: string
          id?: string
          local_ou_link?: string | null
          notas?: string | null
          status?: Database["public"]["Enums"]["status_entrevista"] | null
          tipo: Database["public"]["Enums"]["tipo_entrevista"]
          updated_at?: string | null
        }
        Update: {
          candidato_id?: string
          created_at?: string | null
          data_hora?: string
          empregador_id?: string
          id?: string
          local_ou_link?: string | null
          notas?: string | null
          status?: Database["public"]["Enums"]["status_entrevista"] | null
          tipo?: Database["public"]["Enums"]["tipo_entrevista"]
          updated_at?: string | null
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
      fontes_vagas: {
        Row: {
          ativa: boolean | null
          configuracao: Json | null
          created_at: string | null
          frequencia_minutos: number
          id: string
          nome: string
          proxima_coleta: string | null
          tipo: string
          ultima_coleta: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          ativa?: boolean | null
          configuracao?: Json | null
          created_at?: string | null
          frequencia_minutos?: number
          id?: string
          nome: string
          proxima_coleta?: string | null
          tipo: string
          ultima_coleta?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          ativa?: boolean | null
          configuracao?: Json | null
          created_at?: string | null
          frequencia_minutos?: number
          id?: string
          nome?: string
          proxima_coleta?: string | null
          tipo?: string
          ultima_coleta?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      logs_coleta: {
        Row: {
          created_at: string | null
          detalhes: Json | null
          fonte_id: string
          id: string
          mensagem_erro: string | null
          status: string
          tempo_resposta_ms: number | null
          vagas_atualizadas: number | null
          vagas_duplicadas: number | null
          vagas_novas: number | null
        }
        Insert: {
          created_at?: string | null
          detalhes?: Json | null
          fonte_id: string
          id?: string
          mensagem_erro?: string | null
          status: string
          tempo_resposta_ms?: number | null
          vagas_atualizadas?: number | null
          vagas_duplicadas?: number | null
          vagas_novas?: number | null
        }
        Update: {
          created_at?: string | null
          detalhes?: Json | null
          fonte_id?: string
          id?: string
          mensagem_erro?: string | null
          status?: string
          tempo_resposta_ms?: number | null
          vagas_atualizadas?: number | null
          vagas_duplicadas?: number | null
          vagas_novas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_coleta_fonte_id_fkey"
            columns: ["fonte_id"]
            isOneToOne: false
            referencedRelation: "fontes_vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens: {
        Row: {
          chat_id: string
          conteudo: string
          created_at: string | null
          id: string
          lida: boolean | null
          remetente_id: string
        }
        Insert: {
          chat_id: string
          conteudo: string
          created_at?: string | null
          id?: string
          lida?: boolean | null
          remetente_id: string
        }
        Update: {
          chat_id?: string
          conteudo?: string
          created_at?: string | null
          id?: string
          lida?: boolean | null
          remetente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_remetente_id_fkey"
            columns: ["remetente_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      municipios_angola: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          provincia_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          provincia_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          provincia_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "municipios_angola_provincia_id_fkey"
            columns: ["provincia_id"]
            isOneToOne: false
            referencedRelation: "provincias_angola"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          created_at: string | null
          id: string
          nome_completo: string
          telefone: string | null
          tipo_utilizador: Database["public"]["Enums"]["tipo_utilizador"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome_completo: string
          telefone?: string | null
          tipo_utilizador: Database["public"]["Enums"]["tipo_utilizador"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome_completo?: string
          telefone?: string | null
          tipo_utilizador?: Database["public"]["Enums"]["tipo_utilizador"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      provincias_angola: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      vagas: {
        Row: {
          ativa: boolean | null
          canais_contato: Json | null
          created_at: string | null
          data_coleta: string
          data_publicacao_origem: string | null
          descricao: string
          empresa: string
          hash_dedup: string
          id: string
          link_origem: string
          localidade: string
          moeda: string | null
          provincia_id: string | null
          requisitos: string[] | null
          salario_max: number | null
          salario_min: number | null
          tipo_contrato: string
          titulo_vaga: string
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          canais_contato?: Json | null
          created_at?: string | null
          data_coleta?: string
          data_publicacao_origem?: string | null
          descricao: string
          empresa: string
          hash_dedup: string
          id?: string
          link_origem: string
          localidade: string
          moeda?: string | null
          provincia_id?: string | null
          requisitos?: string[] | null
          salario_max?: number | null
          salario_min?: number | null
          tipo_contrato: string
          titulo_vaga: string
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          canais_contato?: Json | null
          created_at?: string | null
          data_coleta?: string
          data_publicacao_origem?: string | null
          descricao?: string
          empresa?: string
          hash_dedup?: string
          id?: string
          link_origem?: string
          localidade?: string
          moeda?: string | null
          provincia_id?: string | null
          requisitos?: string[] | null
          salario_max?: number | null
          salario_min?: number | null
          tipo_contrato?: string
          titulo_vaga?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vagas_provincia_id_fkey"
            columns: ["provincia_id"]
            isOneToOne: false
            referencedRelation: "provincias_angola"
            referencedColumns: ["id"]
          },
        ]
      }
      vagas_fontes: {
        Row: {
          data_coleta: string
          fonte_id: string
          id: string
          vaga_id: string
        }
        Insert: {
          data_coleta?: string
          fonte_id: string
          id?: string
          vaga_id: string
        }
        Update: {
          data_coleta?: string
          fonte_id?: string
          id?: string
          vaga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vagas_fontes_fonte_id_fkey"
            columns: ["fonte_id"]
            isOneToOne: false
            referencedRelation: "fontes_vagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vagas_fontes_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      visualizacoes_perfil: {
        Row: {
          candidato_id: string
          empregador_id: string
          id: string
          visualizado_em: string | null
        }
        Insert: {
          candidato_id: string
          empregador_id: string
          id?: string
          visualizado_em?: string | null
        }
        Update: {
          candidato_id?: string
          empregador_id?: string
          id?: string
          visualizado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visualizacoes_perfil_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visualizacoes_perfil_empregador_id_fkey"
            columns: ["empregador_id"]
            isOneToOne: false
            referencedRelation: "empregadores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gerar_hash_dedup: {
        Args: { p_empresa: string; p_localidade: string; p_titulo: string }
        Returns: string
      }
      gerar_numero_candidato: { Args: never; Returns: string }
    }
    Enums: {
      status_entrevista: "agendada" | "confirmada" | "cancelada" | "realizada"
      status_pagamento: "pendente" | "aprovado" | "rejeitado"
      tipo_conta_candidato: "basico" | "ativo" | "pro"
      tipo_entrevista: "presencial" | "virtual"
      tipo_utilizador: "candidato" | "empregador"
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
      status_entrevista: ["agendada", "confirmada", "cancelada", "realizada"],
      status_pagamento: ["pendente", "aprovado", "rejeitado"],
      tipo_conta_candidato: ["basico", "ativo", "pro"],
      tipo_entrevista: ["presencial", "virtual"],
      tipo_utilizador: ["candidato", "empregador"],
    },
  },
} as const
