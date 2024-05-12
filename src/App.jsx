import MainLayout from "./layouts/MainLayout";
import About from "./pages/About";
import Home from "./pages/Home";
import LevenshteinDistance from "./pages/LevenshteinDistance";
import JaroWinklerDistance from "./pages/JaroWinklerDistance";
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
              <JaroWinklerDistance />
            </MainLayout>
          }
        />
        <Route
          path="/levenshtein"
          element={
            <MainLayout>
              <LevenshteinDistance />
            </MainLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
