import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  AcceptedResponseEntity,
  CreatedResponseEntity,
  DeletedResponseEntity,
  ForbiddenResponseEntity,
  InvalidResponseEntity,
  LoginResponseEntity,
  SuccessResponseEntity,
  UnAuthorisedResponseEntity,
  UpdatedResponseEntity,
} from './responseEntities';

const ok = (req: Request, res: Response, data: any) => {
  return res.status(StatusCodes.OK).send(new SuccessResponseEntity(data));
};

const login = (req: Request, res: Response, data: any) => {
  return res.status(StatusCodes.OK).send(new LoginResponseEntity(data))
};

const created = (req: Request, res: Response, data: any) => {
  return res.status(StatusCodes.CREATED).send(new CreatedResponseEntity(data));
};

const updated = (req: Request, res: Response, data: any) => {
  return res.status(StatusCodes.OK).send(new UpdatedResponseEntity(data));
};

const deleted = (req: Request, res: Response, data: any) => {
  return res.status(StatusCodes.OK).send(new DeletedResponseEntity(data));
};

const accepted = (req: Request, res: Response, data: any) => {
  return res
    .status(StatusCodes.ACCEPTED)
    .send(new AcceptedResponseEntity(data));
};

const unauthorised = (req: Request, res: Response) => {
  return res
    .status(StatusCodes.UNAUTHORIZED)
    .send(new UnAuthorisedResponseEntity());
};

const invalidRequest = (req: Request, res: Response, errorDetails:any) => {
  return res
    .status(StatusCodes.BAD_REQUEST)
    .send(new InvalidResponseEntity(errorDetails));
};

const forbidden = (req: Request, res: Response, errorDetails: any) => {
  return res
    .status(StatusCodes.BAD_REQUEST)
    .send(new ForbiddenResponseEntity(errorDetails));
};

const ResponseHandler = {
  ok,
  created,
  updated,
  login,
  deleted,
  accepted,
  unauthorised,
  invalidRequest,
  forbidden
};
export default ResponseHandler;
