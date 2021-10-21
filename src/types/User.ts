import { BusinessType, SubcontractorCategory } from '../constants/Bid';

export type User = {
  id: number;
  username: string;
  email: string;
  created: string | Date;
  modified: string | Date;
  roles: any[];
  userDetail?: UserDetail;
  profileMedia?: Media;
};

export interface UserRegisterDto extends Partial<User> {
  password?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  businessType?: BusinessType;
  subContractorCategory?: SubcontractorCategory;
  subContractorName?: string;
}

export type UserDetail = {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  businessType?: BusinessType;
  phone?: string;
  subContractorName?: string;
  subContractorCategory?: SubcontractorCategory;
};

export type Media = {
  id?: number;
  filename: string;
  originalUrl: string;
  smallUrl: string;
  mediumUrl: string;
  largeUrl: string;
  created?: Date;
  modified?: Date;
};
