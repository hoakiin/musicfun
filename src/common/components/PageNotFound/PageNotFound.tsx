import { Link } from "react-router";
import s from "./PageNotFound.module.css";

export const PageNotFound = () => {
  return (
    <div className={s.page}>
      <h1 className={s.title}>404</h1>
      <h2 className={s.subtitle}>page not found</h2>
      <Link to="/" className={s.homeBtn}>Go to Home</Link>
    </div>
  );
};