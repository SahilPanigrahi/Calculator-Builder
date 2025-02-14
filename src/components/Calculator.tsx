"use client";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { Sun, Moon } from "lucide-react";
import { predefinedComponents } from "@/constants/calculatorConstants";

export default function Calculator() {
  const {
    theme,
    toggleTheme,
    historyIndex,
    history,
    addComponent,
    removeComponent,
    components,
    appendInput,
    calculateResult,
    clearInput,
    input,
    loadFromStorage,
    undo,
    redo,
    setComponents,
  } = useCalculatorStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    loadFromStorage();
  }, [theme, loadFromStorage]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Handle Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = components.findIndex((item) => item.id === active.id);
    const newIndex = components.findIndex((item) => item.id === over.id);

    const updatedComponents = [...components];
    const [movedItem] = updatedComponents.splice(oldIndex, 1);
    updatedComponents.splice(newIndex, 0, movedItem);

    setComponents(updatedComponents);
  };

  return (
    <div
      className={`py-10 md:py-0 h-auto md:h-screen flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        className="mb-4 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-300 transition-transform duration-300 ease-in-out transform hover:scale-110"
        onClick={toggleTheme}
        aria-label="Toggle theme between light and dark mode"
      >
        {theme === "dark" ? (
          <Sun size={24} aria-hidden="true" />
        ) : (
          <Moon size={24} aria-hidden="true" />
        )}
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Predefined Components */}
        <div className="w-80 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg">
          <h1
            className="text-xl font-bold p-2 text-center mb-4"
            id="predefined-components-label"
          >
            Design Your Own Calculator
          </h1>
          <div className="grid grid-cols-4 gap-2" aria-labelledby="predefined-components-label">
            {predefinedComponents.map((component, index) => (
              <button
                key={index}
                className="p-4 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 text-xl focus-visible:ring-2 focus-visible:ring-blue-400"
                onClick={() => addComponent({ id: uuid(), ...component })}
                aria-label={`Add ${component.type} button with value ${component.value}`}
              >
                {component.value}
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Interface */}
        <div className="w-80 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg">
          {/* Display */}
          <div
            className="text-right text-2xl p-3 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"
            role="status"
            aria-live="polite"
          >
            {input || "0"}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <button
              className={`p-3 rounded-lg text-white ${
                historyIndex === 0
                  ? "bg-yellow-300 opacity-50 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } focus-visible:ring-2 focus-visible:ring-yellow-300`}
              onClick={undo}
              disabled={historyIndex === 0}
              aria-label="Undo the last action"
              aria-disabled={historyIndex === 0}
            >
              Undo
            </button>
            <button
              className={`p-3 rounded-lg text-white ${
                historyIndex === history.length - 1
                  ? "bg-green-300 opacity-50 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } focus-visible:ring-2 focus-visible:ring-green-300`}
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              aria-label="Redo the last undone action"
              aria-disabled={historyIndex === history.length - 1}
            >
              Redo
            </button>
            <button
              className="col-span-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-300"
              onClick={clearInput}
              aria-label="Clear the calculator input"
            >
              C
            </button>
          </div>

          {/* Sortable Components in Grid */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={components.map((c) => c.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-4 gap-2">
                {components.map((component) => (
                  <SortableItem
                    key={component.id}
                    component={component}
                    removeComponent={removeComponent}
                    calculateResult={calculateResult}
                    appendInput={appendInput}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
