import React, { useEffect, useState } from "react";

import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

import classes from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const history = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
    }
  }, [size.width, menuOpen]);

  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
  };

  const ctaClickHandler = () => {
    menuToggleHandler();
    history("/authenticationForm");
  };

  const disconectHandler = () => {
    localStorage.clear();
    history("/authenticationForm");
    window.location.reload(false);
  };

  const curentUser = JSON.parse(localStorage.getItem("curentUser"));

  return (
    <header className={classes.header}>
      <div className={classes.header__content}>
        <Link to="/" className={classes.header__content__logo}>
          {/* <img src={logo} alt="AMS" /> */} Africa MS
        </Link>
        <nav
          className={`${classes.header__content__nav} ${
            menuOpen && size.width < 768 ? classes.isMenu : ""
          }`}
        >
          <ul>
            <li>
              <Link to="/" onClick={menuToggleHandler}>
                Normes
              </Link>
            </li>
            <li>
              <Link to="/page-two" onClick={menuToggleHandler}>
                A propos de l'Ams
              </Link>
            </li>
            <li>
              <Link to="/page-three" onClick={menuToggleHandler}>
                Actualités
              </Link>
            </li>
            {curentUser ? (
              <li>
                <Link to="/profile" onClick={menuToggleHandler}>
                  {curentUser?.user?.username}
                </Link>
                <button onClick={disconectHandler}>Logout</button>
              </li>
            ) : (
              <button onClick={ctaClickHandler}>Login</button>
            )}
          </ul>
        </nav>
        <div className={classes.header__content__toggle}>
          {!menuOpen ? (
            <BiMenuAltRight onClick={menuToggleHandler} />
          ) : (
            <AiOutlineClose onClick={menuToggleHandler} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
