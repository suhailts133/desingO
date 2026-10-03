import { useFormContext } from "react-hook-form";
import { Layers, } from "lucide-react";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import { STYLE_OPTIONS } from "../../../designer/designs/designData";
import type { IJobRequest } from "../jobInterface";
import { selectStyles } from "../../../../shared/filter/selectStyle";
import type { StylesConfig } from "react-select";
import type { OptionType } from "../../../common/baseData";
import { MATERIAL_OPTIONS } from "../jobData";


export default function AestheticsAndItemsSection() {
  const { control, formState: { errors } } = useFormContext<IJobRequest>();



  return (
    <div className="space-y-4">
      <h3 className="text-lg font-Jost-Semibold text-text-primary flex items-center gap-2">
        <Layers className="w-5 h-5 text-text-faint" /> 5. Aesthetics & Existing Heirlooms
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReactSelectField
          label="Design Styles"
          name="designStyles"
          isMulti={true}
          control={control}
          options={STYLE_OPTIONS}
          error={errors.designStyles?.message}
          styles={selectStyles as StylesConfig<OptionType, true>}
        />

        <ReactSelectField
          label="Preferred Materials"
          name="preferredMaterials"
          isMulti={true}
          control={control}
          options={MATERIAL_OPTIONS}
          styles={selectStyles as StylesConfig<OptionType, true>}
        />
      </div>


    </div>
  );
};
