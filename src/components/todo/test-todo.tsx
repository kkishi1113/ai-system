import { render, screen, fireEvent } from "@testing-library/react";
import ToDo from "./todo"; // ToDoコンポーネントのパスを修正してください

test("TODOを追加できる", () => {
  render(<ToDo />);
  const inputElement = screen.getByPlaceholderText("TODOを追加");
  const addButton = screen.getByText("追加");

  fireEvent.change(inputElement, { target: { value: "テストTODO" } });
  fireEvent.click(addButton);

  expect(screen.getByText("テストTODO")).toBeInTheDocument();
});

test("TODOを完了にできる", () => {
  render(<ToDo />);
  const inputElement = screen.getByPlaceholderText("TODOを追加");
  const addButton = screen.getByText("追加");

  fireEvent.change(inputElement, { target: { value: "完了TODO" } });
  fireEvent.click(addButton);

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);

  expect(screen.getByText("完了TODO")).toHaveClass("line-through");
});

test("TODOを削除できる", () => {
  render(<ToDo />);
  const inputElement = screen.getByPlaceholderText("TODOを追加");
  const addButton = screen.getByText("追加");

  fireEvent.change(inputElement, { target: { value: "削除TODO" } });
  fireEvent.click(addButton);

  const deleteButton = screen.getByRole("button", { name: /削除/i });
  fireEvent.click(deleteButton);

  expect(screen.queryByText("削除TODO")).not.toBeInTheDocument();
});
