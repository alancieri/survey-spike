import { useMemo } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";

// Tema personalizzato per il Renderer (caricato da file JSON)
import rendererTheme from "./theme.json";

interface SurveyRendererProps {
  surveyJson: object;
}

export function SurveyRenderer({ surveyJson }: SurveyRendererProps) {
  const survey = useMemo(() => {
    const model = new Model(surveyJson);

    // Applica il tema
    model.applyTheme(rendererTheme);

    // Log quando un valore cambia (utile per debug)
    model.onValueChanged.add((sender, options) => {
      console.log("📝 Value changed:", {
        name: options.name,
        value: options.value,
        allData: sender.data,
      });
    });

    // Log quando la pagina cambia
    model.onCurrentPageChanged.add((sender, options) => {
      console.log("📄 Page changed:", {
        oldPage: options.oldCurrentPage?.name,
        newPage: options.newCurrentPage?.name,
        pageNumber: sender.currentPageNo + 1,
        totalPages: sender.pageCount,
      });
    });

    // Handler per il completamento del survey
    model.onComplete.add((sender) => {
      console.log("✅ Survey completed!");
      console.log("📊 Final answers:", JSON.stringify(sender.data, null, 2));
    });

    // Handler per validazione
    model.onValidateQuestion.add((_sender, options) => {
      if (options.name === "email" && options.value) {
        const email = options.value as string;
        if (!email.includes("@")) {
          options.error = "Inserisci un indirizzo email valido";
        }
      }
    });

    return model;
  }, [surveyJson]);

  return <Survey model={survey} />;
}
