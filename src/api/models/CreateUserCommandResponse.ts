/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from "../../../api-new/models/CreateUserDto";
export type CreateUserCommandResponse = {
  success?: boolean;
  message?: string | null;
  validationErrors?: Array<string> | null;
  data?: CreateUserDto;
};
