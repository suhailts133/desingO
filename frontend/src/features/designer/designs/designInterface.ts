import type { ImageUploadResult } from "../profile/designerProfileInterface";

export interface IDesign {
  name: string;
  propertyType: { value: string; label: string };
  description: string;
  designStyles: { value: string; label: string }[];
  customStyles?: string;
  services: { value: string; label: string }[];
  customServices?: string;
  spaceType: { value: string; label: string };
  minPrice: number;
  maxPrice: number;
  length: number;
  width: number;
  unit: { value: string; label: string };
  coverImage: FileList;
  gallery: {
    file: File[];
  }[];
}


export interface DesignResponseDTO {
  name: string
  coverImage: string,
  minPrice: string,
  maxPrice: string,
  description: string,
  id: string
}



export interface DesignDetailResponseDTO {
  id: string;
  designerName: string;
  designName: string;
  propertyType: string;
  spaceType: string;
  maxPrice: number;
  minPrice: number;
  services: string[];
  designStyles: string[];
  description: string;
  coverImage: ImageUploadResult;
  gallery: ImageUploadResult[];
  createdAt: string;
  isSaved:boolean
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
  designerName: string,
  minPrice:string
  maxPrice:string
  isSaved:boolean
}


export interface DesignFilterForm {
    designStyles: { label: string; value: string }[] | null;
    propertyTypes: { label: string; value: string }[] | null;
    spaceTypes: { label: string; value: string }[] | null;
    sortBy: { label: string; value: string } | null;
}


export type SelectOption = { label: string; value: string };

export interface EditDesignFields {
    name: string;
    minPrice: number;
    maxPrice: number;
    description: string;
    designStyles: SelectOption[];
    services: SelectOption[];
    spaceType: SelectOption;
    propertyType: SelectOption;
}

