"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { updateTyreLocation } from "@/app/actions/tyrehotel";
import { useLoading } from "@/hooks";

interface LocationDataListProps {
  tyreId: number;
  currentLocation: string | null;
  locations: string[];
}

export default function LocationDataList({ tyreId, currentLocation, locations }: LocationDataListProps) {
  const t = useTranslations("TyreCard");
  const [editing, setEditing] = useState(false);
  const [savedLocation, setSavedLocation] = useState(currentLocation ?? "");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();

  const handleSave = async () => {
    setError(null);
    await withLoading(async () => {
      const result = await updateTyreLocation(tyreId, inputValue);
      if (result.success) {
        setSavedLocation(inputValue);
        setEditing(false);
      } else {
        setError(result.error ?? t("locationError"));
      }
    });
  };

  const handleCancel = () => {
    setInputValue("");
    setError(null);
    setEditing(false);
  };

  const handleStartEditing = () => {
    setInputValue("");
    setEditing(true);
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2 group">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{savedLocation || "—"}</h3>
        <button
          onClick={handleStartEditing}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
          aria-label={t("editLocation")}
        >
          <Pencil size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Input
          id={`location-${tyreId}`}
          list={`locations-${tyreId}`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={savedLocation || t("locationPlaceholder")}
          className="text-lg font-bold h-9"
          autoFocus
          error={!!error}
        />
        <datalist id={`locations-${tyreId}`}>
          {locations.map((loc) => (
            <option key={loc} value={loc} />
          ))}
        </datalist>
        <Button
          size="sm"
          variant="default"
          onClick={handleSave}
          disabled={loading || !inputValue.trim()}
          className="rounded-xl px-2"
          aria-label={t("saveLocation")}
        >
          <Check size={16} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
          className="rounded-xl px-2"
          aria-label={t("cancelEdit")}
        >
          <X size={16} />
        </Button>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
