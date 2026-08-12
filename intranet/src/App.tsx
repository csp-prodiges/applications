import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotesTravaux from "./pages/NotesTravaux";
import Planning from "./pages/Planning";
import Cantine from "./pages/Cantine";
import Commandes from "./pages/Commandes";
import Messagerie from "./pages/Messagerie";
import EspaceEnseignants from "./pages/EspaceEnseignants";
import ActualitesAdmin from "./pages/ActualitesAdmin";
import AdmissionsAdmin from "./pages/AdmissionsAdmin";
import Utilisateurs from "./pages/Utilisateurs";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route
        path="/notes-travaux"
        element={
          <ProtectedRoute roles={["parent", "enseignant"]}>
            <NotesTravaux />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planning"
        element={
          <ProtectedRoute roles={["parent", "enseignant", "admin"]}>
            <Planning />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cantine"
        element={
          <ProtectedRoute roles={["parent"]}>
            <Cantine />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes"
        element={
          <ProtectedRoute roles={["parent", "admin"]}>
            <Commandes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messagerie"
        element={
          <ProtectedRoute roles={["parent", "enseignant", "admin"]}>
            <Messagerie />
          </ProtectedRoute>
        }
      />
      <Route
        path="/espace-enseignants"
        element={
          <ProtectedRoute roles={["enseignant", "admin"]}>
            <EspaceEnseignants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actualites"
        element={
          <ProtectedRoute roles={["admin"]}>
            <ActualitesAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admissions"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdmissionsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/utilisateurs"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Utilisateurs />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
