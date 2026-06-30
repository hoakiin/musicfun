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
            <div className={s.avatar}>{data.login[0].toUpperCase()}</div>
            {data.login}
            <svg className={s.arrow} width="10" height="6" viewBox="0 0 10 6">
              <path d="M0 0L5 6L10 0H0Z" fill="currentColor" />
            </svg>
          </button>
          {isOpen && (
            <ul className={s.dropdown}>
              <li>
                <Link to={Path.Profile} onClick={() => setIsOpen(false)}>
                  <svg className={s.icon} width="20" height="20" viewBox="0 0 24 24">
                    <use href="#profile" />
                  </svg>
                  My profile
                </Link>
              </li>
              <li>
                <button onClick={logoutHandler}>
                  <svg className={s.icon} width="20" height="20" viewBox="0 0 24 24">
                    <use href="#logout" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
      {!data && <Login />}
    </header>
  );
};
