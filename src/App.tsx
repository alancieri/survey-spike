import { Routes, Route } from "react-router-dom";
import { SurveyList } from "./components/SurveyList";
import { SurveyRendererPage } from "./renderer/SurveyRendererPage";
import { SurveyCreatorPage } from "./creator/SurveyCreatorPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SurveyList />} />
      <Route path="/survey/:id" element={<SurveyRendererPage />} />
      <Route path="/creator" element={<SurveyCreatorPage />} />
      <Route path="/creator/:id" element={<SurveyCreatorPage />} />
    </Routes>
  );
}

export default App;
