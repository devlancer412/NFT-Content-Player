import React from "react";

const Input = ({ name, value, handleChange, placeholder, className }) => {
  const classStr = `flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${className}`;
  return (
    <label className="block mb-4">
      <span className="text-gray-700">{name}</span>
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
