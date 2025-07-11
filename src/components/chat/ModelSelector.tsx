import { Bot, ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { AIModel } from "@/lib/graphql";
import { Button } from "../ui/Button";
import { ModelSelectorModal } from "./ModelSelectorModal";

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: AIModel | null | undefined;
  onSelectModel: (model: AIModel) => void;
  compact?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelectModel,
  compact,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfigureModel = (model: AIModel) => {
    console.log("Configure model:", model);
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsModalOpen(true)}
        className={`${compact ? "" : "min-w-[200px]"} justify-between`}
      >
        {!compact && (
          <>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span>{selectedModel?.name || "Select a model"}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </>
        )}

        {compact && <Bot className="w-4 h-4" />}
      </Button>

      <ModelSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={onSelectModel}
        onConfigureModel={handleConfigureModel}
      />
    </>
  );
};
