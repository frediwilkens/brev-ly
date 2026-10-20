import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { ShortLinkPage } from "./pages/short-link-page";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:shortCode" element={<ShortLinkPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
