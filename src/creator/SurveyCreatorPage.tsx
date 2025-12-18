import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SurveyCreator, SurveyCreatorComponent as SurveyCreatorUI } from "survey-creator-react";
import { surveyLocalization } from "survey-core";
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";

import creatorTheme from "./theme.json";
import rendererTheme from "../renderer/theme.json";
import { getSurvey, saveSurvey } from "../services/surveyStorage";

// Imposta le lingue supportate per le traduzioni
surveyLocalization.supportedLocales = ["en", "it", "fr", "de", "es", "zh-cn", "ja", "ar"];

// Nascondi banner licenza per spike/development
const hideLicenseBannerCSS = `
  .svc-creator__banner { display: none !important; }
`;
if (typeof document !== "undefined" && !document.getElementById("hide-license-banner")) {
  const style = document.createElement("style");
  style.id = "hide-license-banner";
  style.textContent = hideLicenseBannerCSS;
  document.head.appendChild(style);
}

export function SurveyCreatorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surveyName, setSurveyName] = useState(id || "");
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [initialJson, setInitialJson] = useState<object | null>(null);

  // Carica il survey esistente se c'è un ID
  useEffect(() => {
    if (id) {
      getSurvey(id)
        .then((json) => {
          setInitialJson(json);
          setSurveyName(id);
        })
        .catch((err) => {
          console.error("Error loading survey:", err);
          alert("Errore nel caricamento del survey");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const creator = useMemo(() => {
    const c = new SurveyCreator({
      showLogicTab: true,
      showJSONEditorTab: true,
      showPreviewTab: true,
      showTranslationTab: true,
      showThemeTab: false,
      isAutoSave: false,
    });

    c.applyCreatorTheme(creatorTheme);

    // Applica il tema del Renderer alla Preview
    c.theme = rendererTheme;

    return c;
  }, []);

  // Imposta il JSON iniziale quando viene caricato
  useEffect(() => {
    if (initialJson && creator) {
      creator.JSON = initialJson;
    }
  }, [initialJson, creator]);

  // Callback quando si salva il survey
  creator.saveSurveyFunc = async (
    saveNo: number,
    callback: (no: number, success: boolean) => void
  ) => {
    if (!surveyName.trim()) {
      alert("Inserisci un nome per il survey");
      callback(saveNo, false);
      return;
    }

    setSaving(true);
    try {
      const json = creator.JSON;
      await saveSurvey(surveyName.trim(), json);
      console.log("💾 Survey saved to Supabase!");
      callback(saveNo, true);

      // Se era un nuovo survey, naviga all'URL con ID
      if (!id) {
        navigate(`/creator/${surveyName.trim()}`, { replace: true });
      }
    } catch (err) {
      console.error("Error saving survey:", err);
      alert("Errore durante il salvataggio");
      callback(saveNo, false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Caricamento...
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

        <input
          type="text"
          value={surveyName}
          onChange={(e) => setSurveyName(e.target.value)}
          placeholder="Nome del survey"
          disabled={!!id}
          style={{
            padding: "8px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            fontSize: "14px",
            width: "200px",
            backgroundColor: id ? "#f1f5f9" : "white",
          }}
        />

        {saving && (
          <span style={{ color: "#64748b", fontSize: "14px" }}>
            Salvataggio...
          </span>
        )}
      </div>

      {/* Creator */}
      <div style={{ height: "calc(100vh - 60px)" }}>
        <SurveyCreatorUI creator={creator} />
      </div>
    </div>
  );
}
