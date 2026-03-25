export interface IDesign {
  name: string;
  propertyType: { value: string; label: string };
  description: string;
  designStyles: { value: string; label: string }[];
  customStyles?: string;
  services: { value: string; label: string }[];
  customServices?: string;
  spaceType: { value: string; label: string };
  startingPrice: string;
  coverImage: FileList;
  gallery: {
    file: File[];
  }[];
}


export interface DesignResponseDTO {
  name: string
  coverImage: string,
  price: string,
  description: string,
  id: string
}



export interface DesignDetailResponseDTO {
  id: string;
  designerName: string;
  designName: string;
  propertyType: string;
  spaceType: string;
  startingPrice: string;
  services: string[];
  designStyles: string[];
  description: string;
  coverImage: string;
  gallery: string[];
  createdAt: string;
}



export interface DesignsQueryParms {
  page?: number,
  designStyles?: { label: string, value: string }[] | null
  propertyTypes?: { label: string, value: string }[] | null
  spaceTypes?: { label: string, value: string }[] | null
  sortBy?: {label:string, value:string }| null
}


export interface GetAllDesignCommonResponseDTO {
  id:string
  name: string,
  spaceType: string,
  designStyles: string[]
  coverImage: string,
  budget: string,
  designerName: string
}


export interface DesignFilterForm {
    designStyles: { label: string; value: string }[] | null;
    propertyTypes: { label: string; value: string }[] | null;
    spaceTypes: { label: string; value: string }[] | null;
    sortBy: { label: string; value: string } | null;
}