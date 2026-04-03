export interface Iuser {
  id:string;
  name:string;
  eamil:string;
  role:'user'|'admin';
}

export interface AuthResponse {
  message:string;
  token:string;
  user:Iuser;
}

export interface UpdateProfile {
  name?:string;
  email?:string;
  password?:string;
}
