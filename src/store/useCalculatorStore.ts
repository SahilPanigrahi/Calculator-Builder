import { create } from "zustand";
import { CalculatorState } from "../types/calculatorTypes"

export const useCalculatorStore = create<CalculatorState>((set) => ({
  components: [],
  input: "",
  theme: "light",
  history: [[]],
  historyIndex: 0,

  // Add a new component
  addComponent: (component) =>
    set((state) => {
      const newComponents = [...state.components, component];
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newComponents];
      localStorage.setItem("calculatorComponents", JSON.stringify(newComponents));
      return { components: newComponents, history: newHistory, historyIndex: state.historyIndex + 1 };
    }),

  // Remove a component by ID
  removeComponent: (id) =>
    set((state) => {
      const newComponents = state.components.filter((c) => c.id !== id);
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newComponents];
      localStorage.setItem("calculatorComponents", JSON.stringify(newComponents));
      return { components: newComponents, history: newHistory, historyIndex: state.historyIndex + 1 };
    }),

  // Append value to the input string
  appendInput: (value) =>
    set((state) => ({
      input: state.input + value,
    })),

  // Clear the calculator input
  clearInput: () => set({ input: "" }),

  // Calculate the result of the current input
  calculateResult: () =>
    set((state) => {
      try {
        const sanitizedInput = state.input.replace(/[^-()\d/*+.]/g, "");
        const result = eval(sanitizedInput).toString();
        return { input: result };
      } catch {
        return { input: "Error" };
      }
    }),

  // Toggle between light and dark themes
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  // Undo the last action
  undo: () =>
    set((state) => {
      const newIndex = Math.max(state.historyIndex - 1, 0);
      return { components: state.history[newIndex], historyIndex: newIndex };
    }),

  // Redo the last undone action
  redo: () =>
    set((state) => {
      const newIndex = Math.min(state.historyIndex + 1, state.history.length - 1);
      return { components: state.history[newIndex], historyIndex: newIndex };
    }),

  // Load saved components from localStorage
  loadFromStorage: () => {
    const saved = localStorage.getItem("calculatorComponents");
    if (saved) {
      const parsed = JSON.parse(saved);
      set({ components: parsed, history: [parsed], historyIndex: 0 });
    }
  },

  // Set components manually (used during drag-and-drop)
  setComponents: (newComponents) =>
    set((state) => {
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newComponents];
      localStorage.setItem("calculatorComponents", JSON.stringify(newComponents));
      return { components: newComponents, history: newHistory, historyIndex: state.historyIndex + 1 };
    }),
}));