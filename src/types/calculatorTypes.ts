export type CalculatorButtonProps = {
  component: CalculatorComponent;
  removeComponent: (id: string) => void;
  calculateResult: () => void;
  appendInput: (value: string) => void;
};

type CalculatorComponent = {
  id: string;
  type: string;
  value: string;
};

export type CalculatorState = {
  components: CalculatorComponent[];
  input: string;
  theme: "light" | "dark";
  history: CalculatorComponent[][];
  historyIndex: number;

  // Actions
  addComponent: (component: CalculatorComponent) => void;
  removeComponent: (id: string) => void;
  appendInput: (value: string) => void;
  clearInput: () => void;
  calculateResult: () => void;
  toggleTheme: () => void;
  undo: () => void;
  redo: () => void;
  loadFromStorage: () => void;
  setComponents: (components: CalculatorComponent[]) => void;
};