export interface Iuser {
  id:string;
  name:string;
  email:string;
  role:'user'|'admin';
}

export interface AuthResponse {
  message:string;
  token:string;
  data:Iuser;
}

export interface UpdateProfile {
  name?:string;
  email?:string;
  password?:string;
}
