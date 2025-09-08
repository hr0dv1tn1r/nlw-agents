import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

createRoot(document.getElementById("root")!).render(
  // `StrictMode` ajuda a identificar problemas potenciais em desenvolvimento.
  <StrictMode>
    {/* Renderiza o componente raiz da aplicação. */}
    <App />
  </StrictMode>,
);
