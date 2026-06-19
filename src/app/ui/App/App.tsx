import { Header, LinearProgress, Sidebar, SvgSprite } from "@/common/components";
import { Routing } from "@/common/routing";
import { ToastContainer } from "react-toastify";
import { PlayerBar } from "@/features/player/ui/PlayerBar/PlayerBar";
import s from "./App.module.css";
import { useGlobalLoading } from "@/common/hooks";

function App() {
  const isGlobalLoading = useGlobalLoading();

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
