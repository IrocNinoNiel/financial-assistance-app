export interface User {               
    user_id: Buffer;                   
    email: string;  
    first_name: string;
    role_id: number;
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
  user_id: number;
  role_id: number;
}