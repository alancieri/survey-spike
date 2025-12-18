import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSurvey } from "../services/surveyStorage";
import { SurveyRenderer } from "./SurveyRenderer";

export function SurveyRendererPage() {
  const { id } = useParams<{ id: string }>();
  const [surveyJson, setSurveyJson] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID del survey non specificato");
      setLoading(false);
      return;
    }

    getSurvey(id)
      .then((json) => {
        setSurveyJson(json);
      })
      .catch((err) => {
        console.error("Error loading survey:", err);
        setError("Errore nel caricamento del survey");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Caricamento...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
        <Link to="/" style={{ color: "#2563eb" }}>
          Torna alla lista
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#64748b",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Torna alla lista
        </Link>

        <span style={{ color: "#1e293b", fontWeight: 500 }}>{id}</span>

        <Link
          to={`/creator/${id}`}
          style={{
            marginLeft: "auto",
            padding: "6px 12px",
            backgroundColor: "#f1f5f9",
            color: "#1e293b",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          Modifica
        </Link>
      </div>

      {/* Survey */}
      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        {surveyJson && <SurveyRenderer surveyJson={surveyJson} />}
      </div>
    </div>
  );
}
