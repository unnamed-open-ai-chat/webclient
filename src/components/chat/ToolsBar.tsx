import { Brain, Globe, Puzzle, Wrench } from "lucide-react";
import React from "react";

import { ToolState } from "@/hooks/useTools";
import { Badge } from "../ui/Badge";

export interface ToolsBarProps {
  toggleTool: (toolId: string) => void;
  toolStates: ToolState[];
}

export const ToolsBar: React.FC<ToolsBarProps> = ({
  toolStates,
  toggleTool,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe":
        return Globe;
      case "Brain":
        return Brain;
      case "Wrench":
        return Wrench;
      case "Puzzle":
        return Puzzle;
      default:
        return Wrench;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4">
      {/* Tool selection badges and config button */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {toolStates.map(({ tool, isEnabled }) => {
            const IconComponent = getIcon(tool.icon);
            return (
              <Badge
                key={tool.id}
                variant={isEnabled ? "primary" : "default"}
                size="sm"
                onClick={() => toggleTool(tool.id)}
                className="gap-1 sm:gap-2 cursor-pointer hover:scale-105 transition-transform duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1"
              >
                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tool.id} Name</span>
                <span className="sm:hidden">{tool.id.split(" ")[0]} Name</span>
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};
