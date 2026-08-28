import { useFormContext } from "react-hook-form";
import { Layers, } from "lucide-react";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import { STYLE_OPTIONS } from "../../../designer/designs/designData";
import type { IJobRequest } from "../jobInterface";

const MATERIAL_OPTIONS = [
  { value: "Teak Wood", label: "Teak Wood" },
  { value: "Laminate", label: "Laminate" },
  { value: "Veneer", label: "Veneer" },
  { value: "Italian Marble", label: "Italian Marble" },
  { value: "Granite", label: "Granite" },
  { value: "PU Finish", label: "PU Finish" },
  { value: "Fluted Charcoal Panels", label: "Fluted Charcoal Panels" },
  { value: "Cane / Rattan", label: "Cane / Rattan" },
];

export default function AestheticsAndItemsSection() {
  const { control, formState: { errors } } = useFormContext<IJobRequest>();



  return (
    <div className="space-y-4">
      <h3 className="text-lg font-Jost-Semibold text-soft-black flex items-center gap-2">
        <Layers className="w-5 h-5 text-blush-deep" /> 5. Aesthetics & Existing Heirlooms
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReactSelectField
          label="Design Styles"
          name="designStyles"
          isMulti={true}
          control={control}
          options={STYLE_OPTIONS}
          error={errors.designStyles?.message}
        />

        <ReactSelectField
          label="Preferred Materials"
          name="preferredMaterials"
          isMulti={true}
          control={control}
          options={MATERIAL_OPTIONS}
        />
      </div>


    </div>
  );
};