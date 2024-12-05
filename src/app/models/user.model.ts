// src/app/models/user.model.ts
export interface User {
  id: number;
  name: string;
  password: string;
  email?: string;   
  role?: string;    
  avatar?: string;
}
