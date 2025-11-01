import { UserStatus } from "@prisma/client";
import { Request } from "express";
import { Role } from "src/common/enums/roles.enum";

export interface RequestUserPayload {
  id: number;
  role: Role;
  status: UserStatus;
}

export interface RequestWithFirebase extends Request {
  firebaseToken?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export interface RequestWithDbUser extends RequestWithFirebase {
  user?: RequestUserPayload;
}

export type RequestWithUser = Request & Required<Pick<RequestWithDbUser, 'user'>>;
