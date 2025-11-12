import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, MessageSquare, FileCheck, Users } from "lucide-react";

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacidade e Segurança de Dados</h1>
            <p className="text-lg text-muted-foreground">
              A tua privacidade é a nossa prioridade. Conhece como protegemos as tuas informações.
            </p>
          </div>

          <div className="space-y-6">
            {/* Proteção de Dados Pessoais */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Lock className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Proteção de Dados Pessoais</h2>
                  <p className="text-muted-foreground mb-4">
                    Todos os dados pessoais são armazenados de forma segura e encriptada. Utilizamos
                    as melhores práticas de segurança da indústria para garantir a proteção das tuas
                    informações.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Encriptação de ponta a ponta para dados sensíveis</li>
                    <li>• Servidores seguros com certificação SSL</li>
                    <li>• Acesso restrito apenas a pessoal autorizado</li>
                    <li>• Backups regulares e seguros</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Privacidade de Candidatos */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Eye className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Privacidade de Candidatos</h2>
                  <p className="text-muted-foreground mb-4">
                    Os teus dados pessoais estão protegidos e só são partilhados quando tu decides:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <strong>Nome, Telefone e Dados de Contacto:</strong> Apenas visíveis para
                      empregadores que agendarem entrevista contigo
                    </li>
                    <li>
                      <strong>CV Profissional:</strong> Controlado por ti, podes descarregar quando
                      quiseres
                    </li>
                    <li>
                      <strong>Número de Candidato:</strong> Identificação anónima até que decidas
                      partilhar mais informações
                    </li>
                    <li>
                      <strong>Conta Pro:</strong> Apenas torna o teu perfil mais visível, mas mantém
                      os dados pessoais protegidos
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Sistema de Chat Seguro */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <MessageSquare className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Sistema de Chat Seguro</h2>
                  <p className="text-muted-foreground mb-4">
                    O nosso sistema de chat é projetado para proteger candidatos:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <strong>Apenas Empregadores Iniciam Conversas:</strong> Candidatos não podem
                      enviar mensagens não solicitadas
                    </li>
                    <li>
                      <strong>Histórico Protegido:</strong> Todas as mensagens são encriptadas e
                      apenas visíveis aos participantes
                    </li>
                    <li>
                      <strong>Denúncias:</strong> Sistema de reporte para comportamentos inadequados
                    </li>
                    <li>
                      <strong>Bloqueio:</strong> Podes bloquear empregadores indesejados a qualquer
                      momento
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Agendamento de Entrevistas */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <FileCheck className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Agendamento de Entrevistas</h2>
                  <p className="text-muted-foreground mb-4">
                    As entrevistas são geridas de forma transparente e segura:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <strong>Presencial:</strong> Endereço da empresa revelado apenas após
                      confirmação
                    </li>
                    <li>
                      <strong>Virtual:</strong> Link de videochamada enviado apenas para
                      participantes confirmados
                    </li>
                    <li>
                      <strong>Dados Partilhados:</strong> No momento do agendamento, o empregador
                      acede aos teus contactos para comunicação
                    </li>
                    <li>
                      <strong>Notificações:</strong> Recebes avisos sobre todas as entrevistas
                      agendadas
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Privacidade de Empregadores */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Privacidade de Empregadores</h2>
                  <p className="text-muted-foreground mb-4">
                    Os dados dos empregadores também estão protegidos:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <strong>Informações da Empresa:</strong> Nome e sector são públicos para
                      transparência
                    </li>
                    <li>
                      <strong>Dados Pessoais do Recrutador:</strong> Nome e contacto apenas
                      partilhados com candidatos em entrevista
                    </li>
                    <li>
                      <strong>Histórico de Contratações:</strong> Mantido privado e confidencial
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Direitos do Utilizador */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <h2 className="text-2xl font-semibold mb-3">Os Teus Direitos</h2>
              <p className="text-muted-foreground mb-4">
                De acordo com as leis de protecção de dados, tens direito a:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Aceder a todos os teus dados pessoais</li>
                <li>✓ Corrigir informações incorrectas</li>
                <li>✓ Eliminar a tua conta e todos os dados associados</li>
                <li>✓ Exportar os teus dados em formato legível</li>
                <li>✓ Revogar consentimentos a qualquer momento</li>
                <li>✓ Opor-te ao processamento dos teus dados</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Para exercer qualquer destes direitos, contacta-nos através do chat de suporte ou
                email: privacidade@empregaja.ao
              </p>
            </Card>

            {/* Conformidade Legal */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-3">Conformidade Legal</h2>
              <p className="text-muted-foreground">
                A EmpregaJá está em conformidade com as leis de protecção de dados de Angola e
                internacionais. Seguimos as melhores práticas de RGPD (Regulamento Geral de Proteção
                de Dados) para garantir a máxima segurança e privacidade dos nossos utilizadores.
              </p>
            </Card>

            {/* Contacto */}
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Tens Dúvidas?</h3>
              <p className="text-muted-foreground mb-4">
                Estamos aqui para te ajudar com qualquer questão sobre privacidade e segurança.
              </p>
              <p className="text-sm text-muted-foreground">
                Email: privacidade@empregaja.ao<br />
                Telefone: +244 XXX XXX XXX<br />
                Chat de Suporte: Disponível no site
              </p>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
