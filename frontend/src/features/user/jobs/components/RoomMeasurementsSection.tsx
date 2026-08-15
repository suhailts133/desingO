import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Ruler, Trash } from "lucide-react";
import { SPACE_OPTIONS } from "../../../designer/designs/designData";
import { InputField } from "../../../../shared/form/InputField";
import { TextAreaField } from "../../../../shared/form/TextAreaField";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import { UNIT_OPTIONS } from "../jobData";
import type { IJobRequest } from "../jobInterface"; 

export default function RoomMeasurementsSection() {
    const { control, register, formState: { errors } } = useFormContext<IJobRequest>();
    
    const { 
        fields: roomFields, 
        append: roomAppend, 
        remove: roomRemove 
    } = useFieldArray({ control, name: "rooms" });

    const addRoom = () => {
        roomAppend({
            spaceType: SPACE_OPTIONS[0],
            length: "", width: "", ceilingHeight: "",
            unit: { value: "ft", label: "ft" },
            notes: "",
        });
    };

    const roomErrors = errors.rooms as unknown as Record<
        number, 
        Record<string, { message?: string }>
    >;

    return (
        <div className="space-y-4">
            <label className="block text-sm font-Jost-Semibold text-gray-700">Room Measurements</label>
            <button
                type="button"
                onClick={addRoom}
                className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
            >
                <div className="bg-gray-100 p-1.5 rounded-md">
                    <Ruler className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex flex-col overflow-hidden text-left">
                    <span className="text-sm text-gray-700 font-medium">Add a Room</span>
                    <span className="text-[11px] text-gray-400">
                        {roomFields.length > 0 ? `${roomFields.length} room${roomFields.length > 1 ? "s" : ""} added` : "Select a space and enter measurements..."}
                    </span>
                </div>
                <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
            </button>

            {errors.rooms && !Array.isArray(errors.rooms) && (
                <p className="text-xs text-red-500 mt-1">{errors.rooms.message as string}</p>
            )}

            {roomFields.length > 0 && (
                <div className="space-y-4">
                    {roomFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="relative p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-3"
                        >
                            <button
                                type="button"
                                onClick={() => roomRemove(index)}
                                className="absolute top-3 right-3 text-white p-1"
                            >
                                <Trash size={12} className="text-error" />
                            </button>

                            <ReactSelectField label="Space Type" name={`rooms.${index}.spaceType`} control={control} placeholder="e.g. Living Room" options={SPACE_OPTIONS} error={roomErrors?.[index]?.spaceType?.message} />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <InputField label="Length" type="number" placeholder="0" registration={register(`rooms.${index}.length`)} error={roomErrors?.[index]?.length?.message} />
                                <InputField label="Width" type="number" placeholder="0" registration={register(`rooms.${index}.width`)} error={roomErrors?.[index]?.width?.message} />
                                <InputField label="Ceiling Height" type="number" placeholder="0" registration={register(`rooms.${index}.ceilingHeight`)} />
                                <ReactSelectField label="Unit" name={`rooms.${index}.unit`} control={control} options={UNIT_OPTIONS} error={roomErrors?.[index]?.unit?.message} />
                            </div>
                            <TextAreaField rows={4} label="Description" placeholder="Any additional detail that the designer should know..." registration={register(`rooms.${index}.notes`)} error={roomErrors?.[index]?.notes?.message} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}