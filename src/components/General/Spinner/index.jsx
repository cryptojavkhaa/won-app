import React from "react";
import Logo from "./../../../assets/iuu-logo.png";
import css from "./style.module.css";

const SpinnerIUU = () => {
  return (
    <div className={css.loader}>
      <img
        src={Logo}
        alt="IUU Logo"
        className="rotate"
        width="100"
        height="100"
      />
    </div>
  );
};

export default SpinnerIUU;
