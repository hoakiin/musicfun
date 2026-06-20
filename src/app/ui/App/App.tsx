import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { Header, LinearProgress, Sidebar, SvgSprite } from "@/common/components";
import { Routing } from "@/common/routing";
import { ToastContainer } from "react-toastify";
import { PlayerBar } from "@/features/player/ui/PlayerBar/PlayerBar";
import s from "./App.module.css";
import { useGlobalLoading } from "@/common/hooks";
import { PAGE_GRADIENTS } from "@/common/constants";

function App() {
  const isGlobalLoading = useGlobalLoading();
  const location = useLocation();

  const gradient = useMemo(() => {
    for (const [prefix, g] of Object.entries(PAGE_GRADIENTS)) {
      if (location.pathname.startsWith(prefix)) return g;
    }
    return null;
  }, [location.pathname]);

  useEffect(() => {
    if (gradient) {
      document.documentElement.style.setProperty("--gradient-main", gradient);
    } else {
      document.documentElement.style.removeProperty("--gradient-main");
    }
  }, [gradient]);

  return (
    <>
      <SvgSprite />
      <Header />
      {isGlobalLoading && <LinearProgress />}
      <div className={s.layout}>
        <Sidebar />
        <div className={s.content}>
          <Routing />
        </div>
      </div>
      <PlayerBar />
      <ToastContainer />
    </>
  );
}

export default App;
