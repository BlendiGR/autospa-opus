import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessMessageProps {
  title: string;
  description?: string;
  className?: string;
}

/**
 * SuccessMessage - Reusable component for displaying success states.
 */
export default function SuccessMessage({ title, description, className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 gap-4 bg-white rounded-xl",
        className
      )}
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900">{title}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  );
}
