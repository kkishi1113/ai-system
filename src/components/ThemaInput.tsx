import React, { useState } from "react";

type ThemeInputProps = {
  onSubmit: (theme: string) => void;
};

const ThemeInput: React.FC<ThemeInputProps> = ({ onSubmit }) => {
  const [theme, setTheme] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim()) {
      onSubmit(theme);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="テーマを入力してください"
        className="border rounded p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        送信
      </button>
    </form>
  );
};

export default ThemeInput;
