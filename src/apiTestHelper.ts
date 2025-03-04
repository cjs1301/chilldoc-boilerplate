/**
 * API 테스트를 위한 헬퍼 클래스와 타입 정의
 * @description
 * API 테스트를 쉽게 구성하고 실행할 수 있도록 도와주는 빌더 패턴 기반의 헬퍼 클래스입니다.
 */

import { HttpMethod } from "./enums/HttpMethod";
import { HttpStatus } from "./enums/HttpStatus";
import supertest, { Response } from "supertest";
import { DSLField } from "./interface/field";
import { validateResponse } from "./validateResponse";

export type PATH_PARAM_TYPES = string | number;
export type QUERY_PARAM_TYPES = string | number | boolean;
export interface APITestConfig {
    pathParams?: Record<string, DSLField<PATH_PARAM_TYPES>>;
    queryParams?: Record<string, DSLField<QUERY_PARAM_TYPES>>;
    requestBody?: Record<string, DSLField>;
    requestHeaders?: Record<string, DSLField<string>>;
    expectedStatus?: HttpStatus | number;
    expectedResponseBody?: Record<string, DSLField>;
    prettyPrint?: boolean;
}

export class APITestBuilder {
    private config: APITestConfig;
    private readonly method: HttpMethod;
    private readonly url: string;
    private readonly request: ReturnType<typeof supertest>;

    constructor(defaults: APITestConfig = {}, method: HttpMethod, url: string, app: any) {
        this.config = { ...defaults };
        this.method = method;
        this.url = url;
        this.request = supertest(app);
    }

    withPathParams(params: Record<string, DSLField<string | number>>): this {
        this.config.pathParams = params;
        return this;
    }

    withQueryParams(params: Record<string, DSLField<string | number | boolean>>): this {
        this.config.queryParams = params;
        return this;
    }

    withRequestBody(body: Record<string, DSLField<any>>): this {
        this.config.requestBody = body;
        return this;
    }

    withRequestHeaders(headers: Record<string, DSLField<string>>): this {
        this.config.requestHeaders = headers;
        return this;
    }

    withoutHeader(headerName: string): this {
        if (this.config.requestHeaders && this.config.requestHeaders[headerName]) {
            delete this.config.requestHeaders[headerName];
        } else {
            console.warn(`Header "${headerName}" not found`);
        }
        return this;
    }

    expectStatus(status: HttpStatus | number): this {
        this.config.expectedStatus = status;
        return this;
    }

    expectResponseBody(body: Record<string, DSLField>): this {
        this.config.expectedResponseBody = body;
        return this;
    }

    withPrettyPrint(): this {
        this.config.prettyPrint = true;
        return this;
    }

    async runTest(): Promise<Response> {
        if (!this.config.expectedStatus) {
            throw new Error("Expected status is required");
        }
        let finalUrl = this.url;
        if (this.config.pathParams) {
            for (const [key, fieldObj] of Object.entries(this.config.pathParams)) {
                finalUrl = finalUrl.replace(
                    `{${key}}`,
                    encodeURIComponent(fieldObj.example.toString()),
                );
            }
        }

        let req: supertest.Test;
        switch (this.method.toLowerCase()) {
            case "get":
                req = this.request.get(finalUrl);
                break;
            case "post":
                req = this.request.post(finalUrl);
                break;
            case "put":
                req = this.request.put(finalUrl);
                break;
            case "delete":
                req = this.request.delete(finalUrl);
                break;
            case "patch":
                req = this.request.patch(finalUrl);
                break;
            default:
                throw new Error(`Unsupported HTTP method: ${this.method}`);
        }

        if (this.config.requestHeaders) {
            for (const [key, headerObj] of Object.entries(this.config.requestHeaders)) {
                const headerValue = headerObj.example;
                if (typeof headerValue === "string") {
                    req.set(key, headerValue);
                }
            }
        }
        if (this.config.queryParams) {
            const queryParams: Record<string, any> = {};
            for (const [key, fieldObj] of Object.entries(this.config.queryParams)) {
                queryParams[key] = fieldObj.example;
            }
            req.query(queryParams);
        }
        if (this.config.requestBody) {
            const body: Record<string, any> = {};
            for (const [key, fieldObj] of Object.entries(this.config.requestBody)) {
                body[key] = fieldObj.example;
            }
            req.send(body);
        }
        if (this.config.expectedStatus) {
            req.expect(this.config.expectedStatus);
        }
        if (this.config.expectedResponseBody) {
            const expectedBody: Record<string, any> = {};
            for (const [key, fieldObj] of Object.entries(this.config.expectedResponseBody)) {
                expectedBody[key] = fieldObj.example;
            }
            req.expect((res: Response) => {
                validateResponse(expectedBody, res.body);
            });
        }
        if (!this.config.expectedResponseBody) {
            req.expect((res: Response) => {
                if (Object.keys(res.body).length > 0) {
                    throw new Error(
                        "Expected response body is required \n    " +
                            JSON.stringify(res.body, null, 2),
                    );
                }
            });
        }
        try {
            const res = await req;
            if (this.config.prettyPrint) {
                console.log("=== API TEST REQUEST ===");
                console.log("Method:", this.method);
                console.log("URL:", finalUrl);
                console.log("Headers:", JSON.stringify(this.config.requestHeaders, null, 2));
                console.log("Query Params:", JSON.stringify(this.config.queryParams, null, 2));
                console.log("Request Body:", JSON.stringify(this.config.requestBody, null, 2));
                console.log("=== API TEST RESPONSE ===");
                console.log("Status:", res.status);
                console.log("Response Body:", JSON.stringify(res.body, null, 2));
            }
            return res;
        } catch (error: any) {
            if (this.config.prettyPrint) {
                console.log("=== API TEST REQUEST (on Error) ===");
                console.log("Method:", this.method);
                console.log("URL:", finalUrl);
                console.log("Headers:", JSON.stringify(this.config.requestHeaders, null, 2));
                console.log("Query Params:", JSON.stringify(this.config.queryParams, null, 2));
                console.log("Request Body:", JSON.stringify(this.config.requestBody, null, 2));
                if (error.response) {
                    console.log("=== API TEST RESPONSE (Error) ===");
                    console.log("Status:", error.response.status);
                    console.log("Response Body:", JSON.stringify(error.response.body, null, 2));
                } else {
                    console.log("Error Message:", error.message);
                }
            }
            throw error;
        }
    }

    then<TResult1 = Response, TResult2 = never>(
        resolve?: ((value: Response) => TResult1 | PromiseLike<TResult1>) | null,
        reject?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
        return this.runTest().then(resolve, reject);
    }
}
