import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app/ui/App/App.tsx";
import "./index.css";
import {Provider} from 'react-redux'
import { store } from "./app/model/store.ts";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/musicfun">
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)
