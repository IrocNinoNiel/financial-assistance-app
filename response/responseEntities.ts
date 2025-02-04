import { StatusCodes } from 'http-status-codes';

interface ResponseInterface {
  statusCode: number;
  message: string;
  generatedAt: number;
  data?: any;
}

export class ResponseEntity implements ResponseInterface {
  public statusCode: number;
  public message: string;
  public generatedAt: number;
  public data: any;
  constructor(statusCode: number, message: string, data: any = []) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.generatedAt = Date.now();
  }
}

export class SuccessResponseEntity extends ResponseEntity {
  constructor(data: any) {
    super(StatusCodes.OK, 'Request Successfully Accepted!', data);
  }
}


export class LoginResponseEntity extends ResponseEntity {
  constructor(data: any) {
    super(StatusCodes.OK, 'Login Successfully', data);
  }
}

export class CreatedResponseEntity extends ResponseEntity {
  constructor(data: any) {
    super(StatusCodes.CREATED, 'Resource Successfully Created!', data);
  }
}

export class UpdatedResponseEntity extends ResponseEntity {
  constructor(data: any) {
    super(StatusCodes.OK, 'Resource Successlly Updated!', data);
  }
}

export class DeletedResponseEntity extends ResponseEntity {
  constructor(data: any) {
    super(StatusCodes.OK, 'Resource Successlly Deleted!', data);
  }
}

export class AcceptedResponseEntity extends ResponseEntity {
  constructor(data: any) {
    super(StatusCodes.ACCEPTED, 'Request Successlly Accepted!', data);
  }
}

export class UnAuthorisedResponseEntity {
  public errorMessage = "UNAUTHORIZED_REQUEST"
  public description = "You don't have the necessary permissions to perform this action. Please ensure you have the required privileges."
  public generatedAt = Date.now();
}

export class ForbiddenResponseEntity {
  public errorMessage = "FORBIDDEN"
  public description = "The resource requested is forbidden for your API Key."
  public generatedAt = Date.now();
  public errorDetails: any// TODO: FIX This
  constructor(errorDetails: any) {
    this.errorDetails = errorDetails;
  }
}

// InternalServerErrorEntity
export class InternalServerErrorEntity {
  public errorMessage = "INTERNAL-SERVER-ERROR"
  public description = "Internal Server Error"
  public generatedAt = Date.now();
  public errorDetails: any// TODO: FIX This
  constructor(errorDetails: any) {
    this.errorDetails = errorDetails;
  }
}

export class InvalidResponseEntity{
  public errorMessage = "INVALID-REQUEST"
  public generatedAt = Date.now();
  public description = "Request is not well-formed, syntactically incorrect, or violates schema."
  public errorDetails: any// TODO: FIX This
  constructor(errorDetails: any) {
    this.errorDetails = errorDetails;
  }
}