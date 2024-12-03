export interface SignUpFormErrors {
  [key: string]: string;
}

export interface SignUpMetadata {
  [key: string]: any;
}

export interface UserInfoFormData {
  name: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface LocationFormData {
  location: string;
  locationCode: string;
}
