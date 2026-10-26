import { BrowserRouter } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </BrowserRouter>
  );
}
