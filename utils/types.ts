export interface LoginRequest {
    username: string;
    password: string;
}

export interface ErrorValidationResult {
    message: string;
    errors: error[];
}

export interface error{ 
    field: string; message: string 
}

export interface RegisterRequest {
    username: string;
    password: string;
    repassword: string;
    role: string;
    mobileNumber: string;
    name: {
        firstName: string;
        lastName: string;
        middleName: string;
    }
}

export const RecordStatus = {
    DELETED: false,
    ACTIVE: true
}

export interface UserResponse {
    user_id?: string,
    email?: string,
    token?: string
}

export interface StudentRequest {
    name: {
      firstName: string;
      middleName: string;
      lastName: string;
      extension?: string;
    };
    sex: string;
    placeOfBirth: string;
    birthdate: string;
    height: number;
    weight: number;
    address: {
      permanent: string;
      current: string;
    };
    email: string;
    mobileNumber: string;
    soloParent: boolean;
    childOfSoloParent: boolean;
    indigenous: {
      isMember: boolean;
      group?: string;
    };
    spEd: boolean;
    pwd: boolean;
    education: {
      grade12: {
        strand: string;
        schoolName: string;
        schoolAddress: string;
        privateOrPublic: "Private" | "Public";
        yearOfGraduation: number;
      };
      college?: {
        programName: string;
        yearLevel: number;
        awardHonor?: string;
        organization?: string;
        schoolName: string;
        schoolAddress: string;
        privateOrPublic: "Private" | "Public";
      };
    };
    emergencyContact: {
      fullName: string;
      mobileNumber: string;
      relationship: string;
    };
    family: {
      father: {
        firstName: string;
        middleName: string;
        lastName: string;
        extension?: string;
        occupation: string;
        income: number;
        mobileNumber: string;
      };
      mother: {
        firstName: string;
        middleName: string;
        lastName: string;
        extension?: string;
        occupation: string;
        income: number;
        mobileNumber: string;
      };
      guardian: {
        firstName: string;
        middleName: string;
        lastName: string;
        extension?: string;
        occupation: string;
        income: number;
        mobileNumber: string;
      };
      emergencyContact: {
        fullName: string;
        mobileNumber: string;
        relationship: string;
      };
      siblings: SiblingRequest[];
    };
};

export interface SiblingRequest {
    name: string;
    birthdate: string;
    age: number;
    status: string;
    remarks: string;
    livingWithParents: boolean;
    ownHouse: boolean;
}