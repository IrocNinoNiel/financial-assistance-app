export interface User {                                 
    email: string;  
    first_name: string;
    role_id: Buffer;
    middle_name?: string;
    last_name: string;
    mobile_number: string;          
    password: string;       
    created_at?: Date;          
    updated_at?: Date;          
    created_by?: Buffer;       
    updated_by?: Buffer;      
    recordStatus?: boolean;
}

export interface UserRole {
  user_id: Buffer;
  role_id: Buffer;
}