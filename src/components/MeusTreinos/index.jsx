// src/pages/MeusTreinos/MeusTreinos.jsx
import { useEffect, useState } from "react";
import { getdadosUsuario } from "../../services/Usuario/usuarioAuthService";

export default function MeusTreinos() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    try {
      const response = await getdadosUsuario();
      const data = response?.data?.user || response?.data;
      setUsuario(data);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
    setLoading(false);
  };

  const abrirModal = (item) => {
    setExercicioSelecionado(item);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setExercicioSelecionado(null);
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Carregando...</p>;
  }

  if (!usuario) {
    return <p style={{ padding: 20 }}>Usuário não encontrado.</p>;
  }

  const treinoUsuario = usuario.usuarios_treino?.[0];
  const treino = treinoUsuario?.treino;
  const dias = treino?.treinos_dia || [];
  const linkDieta = treinoUsuario?.dieta;

  const diasSemanaOrdenados = [
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
    "Domingo",
  ];

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ marginBottom: 10, textAlign: "center" }}>Meus Exercícios</h1>

      {linkDieta && (
        <a
          href={`http://${linkDieta}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginBottom: 25,
            padding: "10px 18px",
            background: "#007bff",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          📄 Abrir Minha Dieta
        </a>
      )}

      {diasSemanaOrdenados.map((diaSemana) => {
        const exerciciosDoDia = dias.filter(
          (d) => d.Dia_da_Semana === diaSemana
        );

        if (exerciciosDoDia.length === 0) return null;

        // 🔥 Agrupar por TODAS as categories (cada vídeo pode ter uma category)
        const exerciciosPorCategoria = exerciciosDoDia.reduce((acc, ex) => {
          const categorias =
            ex.exercicio?.videos?.map((v) => v.category) || ["Sem Categoria"];

          categorias.forEach((cat) => {
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(ex);
          });

          return acc;
        }, {});

        return (
          <div
            key={diaSemana}
            style={{
              marginBottom: 40,
              width: "100%",
              maxWidth: 1000,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                padding: "4px 0",
                color: "#007bff",
                fontSize: 20,
                marginBottom: 12,
                fontWeight: "bold",
              }}
            >
              {diaSemana}
            </h2>

            {/* 🔥 AGORA LISTANDO CATEGORIAS */}
            {Object.keys(exerciciosPorCategoria).map((categoria) => (
              <div key={categoria} style={{ marginBottom: 25 }}>
                <h3
                  style={{
                    color: "#333",
                    marginBottom: 10,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {categoria}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 15,
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  {exerciciosPorCategoria[categoria].map((dia) => (
                    <div
                      key={dia.id}
                      onDoubleClick={() => abrirModal(dia)}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: 12,
                        padding: "14px",
                        background: "#fafafa",
                        cursor: "pointer",
                        width: "260px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <h3 style={{ margin: 0, color: "#222" }}>
                        {dia.exercicio?.nome}
                      </h3>

                      <p style={{ margin: "6px 0", color: "#444" }}>
                        <strong>Séries:</strong> {dia.Series} •{" "}
                        <strong>Reps:</strong> {dia.Repeticoes}
                      </p>

                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "#777",
                          fontStyle: "italic",
                        }}
                      >
                        (Clique duas vezes para ver completo)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* MODAL */}
      {modalAberto && exercicioSelecionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            zIndex: 9999,
          }}
          onClick={fecharModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              width: "95%",
              maxWidth: 700,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2>{exercicioSelecionado.exercicio?.nome}</h2>

            <p>
              <strong>Dia da semana:</strong>{" "}
              {exercicioSelecionado.Dia_da_Semana}
            </p>

            <p>
              <strong>Séries:</strong> {exercicioSelecionado.Series}
            </p>

            <p>
              <strong>Repetições:</strong> {exercicioSelecionado.Repeticoes}
            </p>

            <p>
              <strong>Descanso:</strong> {exercicioSelecionado.Descanso}s
            </p>

            <p style={{ marginTop: 10 }}>
              <strong>Descrição:</strong>{" "}
              {exercicioSelecionado.exercicio?.descricao}
            </p>

            {exercicioSelecionado.exercicio?.videos?.map((video) => (
              <video
                key={video.id}
                src={`http://${video.url}`}
                controls
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 10,
                  marginTop: 20,
                }}
              />
            ))}

            <button
              onClick={fecharModal}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                background: "#222",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
