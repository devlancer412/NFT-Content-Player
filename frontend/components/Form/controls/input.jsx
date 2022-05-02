import React from "react";

const Input = ({ name, value, handleChange, placeholder, className }) => {
  const classStr = `flex-1 appearance-none w-full py-2 px-4 bg-[#182753] bg-opacity-50 text-white placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${className}`;
  return (
    <label className="block mb-4">
      <span className="text-white">{name}</span>
      <div className=" relative ">
        <input
          type="text"
          className={classStr}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </label>
  );
};

export default Input;
