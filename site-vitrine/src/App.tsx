import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Accueil from "./pages/Accueil";
import Ecole from "./pages/Ecole";
import Vision from "./pages/Vision";
import Programme from "./pages/Programme";
import Admissions from "./pages/Admissions";
import Contact from "./pages/Contact";
import Actualites from "./pages/Actualites";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/ecole" element={<Ecole />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/programme" element={<Programme />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/actualites" element={<Actualites />} />
      </Routes>
    </Layout>
  );
}
