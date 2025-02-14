"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { CalculatorButtonProps } from "../types/calculatorTypes"

export default function SortableItem({
  component,
  removeComponent,
  calculateResult,
  appendInput,
}: CalculatorButtonProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: component.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex flex-col items-center">
      <div className="flex bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab mb-1 text-gray-600 dark:text-gray-300 pl-2"
          tabIndex={0}
          aria-label="Drag handle"
          role="button"
          aria-grabbed="false"
        >
          <GripVertical size={16} />
        </button>

        {/* Calculator Button */}
        <button
          className="w-full py-4 pr-4 pl-3 text-xl"
          onClick={() => {
            if (component.value === "=") {
              calculateResult();
            } else {
              appendInput(component.value);
            }
          }}
          aria-label={`Calculator button ${component.value}`}
        >
          {component.value}
        </button>
      </div>

      {/* Remove Button */}
      <button
        className="absolute hover:rotate-90 transition ease-in -top-1 -right-1 text-[8px] bg-red-500 text-white px-[7px] py-1 rounded-full"
        onClick={() => removeComponent(component.id)}
        aria-label="Remove button"
      >
        ✕
      </button>
    </div>
  );
}
