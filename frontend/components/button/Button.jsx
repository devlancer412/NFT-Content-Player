import React from "react";

const Button = ({
  className = "",
  text = "button",
  size = "base",
  link,
  icon = null,
  iconPosition = "left",
  full = false,
  ...newProps
}) => {
  let finalClass = `${className} inline-block rounded-sm font-medium border border-solid cursor-pointer text-center transition-colors duration-200`;
  if (size === "xs") finalClass += " text-xs";
  else if (size === "sm") finalClass += " text-sm";
  else if (size === "base") finalClass += " text-base";
  else if (size === "lg") finalClass += " text-lg";
  else if (size === "xl") finalClass += " text-xl";

  if (full) finalClass += " w-full";
  let content = text;
  if (icon) {
    if (iconPosition === "left")
      content = (
        <>
          {React.cloneElement(icon, { className: "mr-2" })}
          {text}
        </>
      );
    else if (iconPosition === "right")
      content = (
        <>
          {text}
          {React.cloneElement(icon, { className: "ml-2" })}
        </>
      );
  }
  let ButtonTag = link ? "a" : "div";
  return (
    <ButtonTag href={link} className={finalClass} {...newProps}>
      {content}
    </ButtonTag>
  );
};

export default Button;
