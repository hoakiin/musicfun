import { Header, LinearProgress, Sidebar } from "@/common/components";
import { Routing } from "@/common/routing";
import { ToastContainer } from "react-toastify";
import s from "./App.module.css";
import { useGlobalLoading } from "@/common/hooks";

function App() {
  const isGlobalLoading = useGlobalLoading();

  return (
    <>
      <Header />
      {isGlobalLoading && <LinearProgress />}
      <div className={s.layout}>
        <Sidebar />
        <div className={s.content}>
          <Routing />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
