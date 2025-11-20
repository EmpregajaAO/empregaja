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
      assessment_questions: {
        Row: {
          assessment_id: string
          correct_answer: string
          created_at: string | null
          explanation: string | null
          id: string
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          order_number: number
          points: number | null
          question_text: string
          question_type: string | null
        }
        Insert: {
          assessment_id: string
          correct_answer: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          order_number: number
          points?: number | null
          question_text: string
          question_type?: string | null
        }
        Update: {
          assessment_id?: string
          correct_answer?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          order_number?: number
          points?: number | null
          question_text?: string
          question_type?: string | null
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
      certificates: {
        Row: {
          certificate_number: string
          completion_date: string
          course_title: string
          enrollment_id: string
          final_score: number
          id: string
          issued_at: string | null
          pdf_url: string | null
          student_name: string
          verification_code: string | null
        }
        Insert: {
          certificate_number: string
          completion_date: string
          course_title: string
          enrollment_id: string
          final_score: number
          id?: string
          issued_at?: string | null
          pdf_url?: string | null
          student_name: string
          verification_code?: string | null
        }
        Update: {
          certificate_number?: string
          completion_date?: string
          course_title?: string
          enrollment_id?: string
          final_score?: number
          id?: string
          issued_at?: string | null
          pdf_url?: string | null
          student_name?: string
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "course_enrollments"
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
      course_assessments: {
        Row: {
          assessment_type: string
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          max_attempts: number | null
          module_id: string | null
          order_number: number | null
          passing_score: number | null
          time_limit_minutes: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assessment_type: string
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_attempts?: number | null
          module_id?: string | null
          order_number?: number | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assessment_type?: string
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_attempts?: number | null
          module_id?: string | null
          order_number?: number | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_assessments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_assessments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_chat_messages: {
        Row: {
          created_at: string | null
          enrollment_id: string
          id: string
          lesson_id: string | null
          message_metadata: Json | null
          message_text: string
          sender_role: string
        }
        Insert: {
          created_at?: string | null
          enrollment_id: string
          id?: string
          lesson_id?: string | null
          message_metadata?: Json | null
          message_text: string
          sender_role: string
        }
        Update: {
          created_at?: string | null
          enrollment_id?: string
          id?: string
          lesson_id?: string | null
          message_metadata?: Json | null
          message_text?: string
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_chat_messages_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_chat_messages_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          candidato_id: string
          certificate_issued: boolean | null
          completed_at: string | null
          comprovativo_id: string | null
          course_id: string
          enrolled_at: string | null
          final_score: number | null
          id: string
          payment_verified: boolean | null
          status: string | null
        }
        Insert: {
          candidato_id: string
          certificate_issued?: boolean | null
          completed_at?: string | null
          comprovativo_id?: string | null
          course_id: string
          enrolled_at?: string | null
          final_score?: number | null
          id?: string
          payment_verified?: boolean | null
          status?: string | null
        }
        Update: {
          candidato_id?: string
          certificate_issued?: boolean | null
          completed_at?: string | null
          comprovativo_id?: string | null
          course_id?: string
          enrolled_at?: string | null
          final_score?: number | null
          id?: string
          payment_verified?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_comprovativo_id_fkey"
            columns: ["comprovativo_id"]
            isOneToOne: false
            referencedRelation: "comprovativos_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
          category: string
          created_at: string | null
          description: string
          duration_weeks: number
          id: string
          is_active: boolean | null
          level: string | null
          passing_score: number | null
          price_kz: number
          short_description: string | null
          thumbnail_url: string | null
          title: string
          total_lessons: number | null
          total_modules: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration_weeks: number
          id?: string
          is_active?: boolean | null
          level?: string | null
          passing_score?: number | null
          price_kz: number
          short_description?: string | null
          thumbnail_url?: string | null
          title: string
          total_lessons?: number | null
          total_modules?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration_weeks?: number
          id?: string
          is_active?: boolean | null
          level?: string | null
          passing_score?: number | null
          price_kz?: number
          short_description?: string | null
          thumbnail_url?: string | null
          title?: string
          total_lessons?: number | null
          total_modules?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
          data_admissao?: string
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
            isOneToOne: true
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
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
      notificacoes_push: {
        Row: {
          data_envio: string | null
          id: string
          lida: boolean | null
          mensagem: string
          metadados: Json | null
          tipo: string
          titulo: string
          user_id: string | null
        }
        Insert: {
          data_envio?: string | null
          id?: string
          lida?: boolean | null
          mensagem: string
          metadados?: Json | null
          tipo: string
          titulo: string
          user_id?: string | null
        }
        Update: {
          data_envio?: string | null
          id?: string
          lida?: boolean | null
          mensagem?: string
          metadados?: Json | null
          tipo?: string
          titulo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      perfis: {
        Row: {
          created_at: string | null
          data_validacao: string | null
          id: string
          nome_completo: string
          status_validacao: string | null
          telefone: string | null
          tipo_utilizador: Database["public"]["Enums"]["tipo_utilizador"]
          updated_at: string | null
          user_id: string
          validado_por: string | null
        }
        Insert: {
          created_at?: string | null
          data_validacao?: string | null
          id?: string
          nome_completo: string
          status_validacao?: string | null
          telefone?: string | null
          tipo_utilizador: Database["public"]["Enums"]["tipo_utilizador"]
          updated_at?: string | null
          user_id: string
          validado_por?: string | null
        }
        Update: {
          created_at?: string | null
          data_validacao?: string | null
          id?: string
          nome_completo?: string
          status_validacao?: string | null
          telefone?: string | null
          tipo_utilizador?: Database["public"]["Enums"]["tipo_utilizador"]
          updated_at?: string | null
          user_id?: string
          validado_por?: string | null
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
      salarios: {
        Row: {
          ano: number
          bonificacoes: number | null
          created_at: string | null
          data_pagamento: string | null
          deducoes: number | null
          funcionario_id: string
          id: string
          mes: number
          observacoes: string | null
          status: string | null
          updated_at: string | null
          valor: number
          valor_liquido: number
        }
        Insert: {
          ano: number
          bonificacoes?: number | null
          created_at?: string | null
          data_pagamento?: string | null
          deducoes?: number | null
          funcionario_id: string
          id?: string
          mes: number
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          valor: number
          valor_liquido: number
        }
        Update: {
          ano?: number
          bonificacoes?: number | null
          created_at?: string | null
          data_pagamento?: string | null
          deducoes?: number | null
          funcionario_id?: string
          id?: string
          mes?: number
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          valor?: number
          valor_liquido?: number
        }
        Relationships: [
          {
            foreignKeyName: "salarios_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      student_assessment_attempts: {
        Row: {
          answers: Json | null
          assessment_id: string
          attempt_number: number
          completed_at: string | null
          enrollment_id: string
          id: string
          max_score: number | null
          passed: boolean | null
          percentage: number | null
          score: number | null
          started_at: string | null
          time_taken_minutes: number | null
        }
        Insert: {
          answers?: Json | null
          assessment_id: string
          attempt_number: number
          completed_at?: string | null
          enrollment_id: string
          id?: string
          max_score?: number | null
          passed?: boolean | null
          percentage?: number | null
          score?: number | null
          started_at?: string | null
          time_taken_minutes?: number | null
        }
        Update: {
          answers?: Json | null
          assessment_id?: string
          attempt_number?: number
          completed_at?: string | null
          enrollment_id?: string
          id?: string
          max_score?: number | null
          passed?: boolean | null
          percentage?: number | null
          score?: number | null
          started_at?: string | null
          time_taken_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "course_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_assessment_attempts_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          enrollment_id: string
          id: string
          last_accessed_at: string | null
          lesson_id: string
          time_spent_minutes: number | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          enrollment_id: string
          id?: string
          last_accessed_at?: string | null
          lesson_id: string
          time_spent_minutes?: number | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          enrollment_id?: string
          id?: string
          last_accessed_at?: string | null
          lesson_id?: string
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
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
      vagas: {
        Row: {
          ativa: boolean | null
          canais_contato: Json | null
          created_at: string | null
          data_coleta: string
          data_publicacao_origem: string | null
          descricao: string
          empresa: string
          external_id: string | null
          hash_dedup: string
          id: string
          link_origem: string
          localidade: string
          moeda: string | null
          origem: string | null
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
          external_id?: string | null
          hash_dedup: string
          id?: string
          link_origem: string
          localidade: string
          moeda?: string | null
          origem?: string | null
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
          external_id?: string | null
          hash_dedup?: string
          id?: string
          link_origem?: string
          localidade?: string
          moeda?: string | null
          origem?: string | null
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
      fontes_publicas: {
        Row: {
          source_types: number | null
          total_active_sources: number | null
        }
        Relationships: []
      }
      public_job_stats: {
        Row: {
          collection_date: string | null
          total_new_jobs: number | null
          total_sources: number | null
        }
        Relationships: []
      }
      student_assessment_questions: {
        Row: {
          assessment_id: string | null
          explanation: string | null
          id: string | null
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          order_number: number | null
          points: number | null
          question_text: string | null
          question_type: string | null
        }
        Insert: {
          assessment_id?: string | null
          explanation?: string | null
          id?: string | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          order_number?: number | null
          points?: number | null
          question_text?: string | null
          question_type?: string | null
        }
        Update: {
          assessment_id?: string | null
          explanation?: string | null
          id?: string | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          order_number?: number | null
          points?: number | null
          question_text?: string | null
          question_type?: string | null
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
    }
    Functions: {
      calculate_course_progress: {
        Args: { p_enrollment_id: string }
        Returns: number
      }
      gerar_hash_dedup: {
        Args: { p_empresa: string; p_localidade: string; p_titulo: string }
        Returns: string
      }
      gerar_numero_candidato: { Args: never; Returns: string }
      gerar_numero_certificado: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "funcionario" | "candidato" | "empregador"
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
      app_role: ["admin", "funcionario", "candidato", "empregador"],
      status_entrevista: ["agendada", "confirmada", "cancelada", "realizada"],
      status_pagamento: ["pendente", "aprovado", "rejeitado"],
      tipo_conta_candidato: ["basico", "ativo", "pro"],
      tipo_entrevista: ["presencial", "virtual"],
      tipo_utilizador: ["candidato", "empregador"],
    },
  },
} as const
