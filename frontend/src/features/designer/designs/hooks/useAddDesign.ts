import { useDesignServices } from "../designService";
export const useAddDesign = () => {
  const { addDesign, isLoading } = useDesignServices();
  const handleSubmission = async (formData: FormData) => await addDesign(formData);
  return {
    handleSubmission,
    isLoading,
  };
};
