import { Path } from "@/common/routing";
import { useGetMeQuery, useLogoutMutation } from "@/features/auth/api/authApi";
import { Login } from "@/features/auth/ui/Login/Login";
import { Link } from "react-router";
import s from "./Header.module.css";
import { useState, useRef, useEffect } from "react";

export const Header = () => {
  const { data } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const logoutHandler = () => logout();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={s.container}>
      {data && (
        <div className={s.loginContainer} ref={dropdownRef}>
          <button
            className={s.loginBtn}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {data.login}
          </button>
          {isOpen && (
            <ul className={s.dropdown}>
              <li>
                <Link to={Path.Profile} onClick={() => setIsOpen(false)}>
                  My profile
                </Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </ul>
          )}
        </div>
      )}
      {!data && <Login />}
    </header>
  );
};
