/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DepartmentListResponse } from '../models/DepartmentListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepartmentService {
    /**
     * @param version
     * @returns DepartmentListResponse Success
     * @throws ApiError
     */
    public static getApiVDepartment(
        version: string,
    ): CancelablePromise<DepartmentListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/department',
            path: {
                'version': version,
            },
        });
    }
}
