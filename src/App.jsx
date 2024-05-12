import MainLayout from "./layouts/MainLayout";
import About from "./pages/About";
import Home from "./pages/Home";
import JaroWinklerDistanceVoice from "./pages/JaroWinklerDistanceVoice";
import LevenshteinDistanceVoice from "./pages/LevenshteinDistanceVoice";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/jaro-winkler"
          element={
            <MainLayout>
              <JaroWinklerDistanceVoice />
            </MainLayout>
          }
        />
        <Route
          path="/levenshtein"
          element={
            <MainLayout>
              <LevenshteinDistanceVoice />
            </MainLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
