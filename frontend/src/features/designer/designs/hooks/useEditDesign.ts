import { useDesignServices } from "../designService";

export const useEditDesign = () => {
  const { editDesign, isEditing } = useDesignServices();

  const handleUpdation = async ({ formdata, id }: { formdata: FormData; id: string }) => await editDesign({ formdata, id });

  return {
    handleUpdation,
    isEditing,
  };
};
