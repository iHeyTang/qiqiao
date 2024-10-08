/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface OssCredentials {
  AccessKeyId: string;
  AccessKeySecret: string;
  SecurityToken: string;
}

export interface PaginationDTO {
  pageSize: number;
  current: number;
  total: number;
}

export interface ArticleListItemDTO {
  id: string;
  title: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  /** @format date-time */
  published_at: string;
}

export interface ArticlePageResultDTO {
  pagination: PaginationDTO;
  list: ArticleListItemDTO[];
}

export interface ArticleDetailDTO {
  id: string;
  title: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  content: string;
  /** @format date-time */
  published_at: string;
}

export interface ArticleCreateDTO {
  title: string;
  content: string;
}

export interface ArticleCreateResultDTO {
  id: string;
  /** @format date-time */
  created_at: string;
}

export interface ArticleEditDTO {
  title: string;
  content: string;
}

export interface ArticleEditResultDTO {
  id: string;
  /** @format date-time */
  updated_at: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface LoginResultDTO {
  access_token: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Qiqiao API
 * @version 1.0
 * @contact
 *
 * The Qiqiao API description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @name OssControllerCredentials
     * @request GET:/api/oss/credentials
     * @response `200` `OssCredentials`
     */
    ossControllerCredentials: (params: RequestParams = {}) =>
      this.request<OssCredentials, any>({
        path: `/api/oss/credentials`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ArticleControllerList
     * @request GET:/api/article
     * @response `200` `ArticlePageResultDTO`
     */
    articleControllerList: (
      query: {
        pageSize: number;
        current: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArticlePageResultDTO, any>({
        path: `/api/article`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ArticleControllerCreate
     * @request POST:/api/article
     * @response `200` `ArticleCreateResultDTO`
     */
    articleControllerCreate: (data: ArticleCreateDTO, params: RequestParams = {}) =>
      this.request<ArticleCreateResultDTO, any>({
        path: `/api/article`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ArticleControllerDetail
     * @request GET:/api/article/{id}
     * @response `200` `ArticleDetailDTO`
     */
    articleControllerDetail: (id: number, params: RequestParams = {}) =>
      this.request<ArticleDetailDTO, any>({
        path: `/api/article/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ArticleControllerDelete
     * @request DELETE:/api/article/{id}
     * @response `200` `void`
     */
    articleControllerDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/article/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @name ArticleControllerEdit
     * @request PUT:/api/article/{id}
     * @response `200` `ArticleEditResultDTO`
     */
    articleControllerEdit: (id: number, data: ArticleEditDTO, params: RequestParams = {}) =>
      this.request<ArticleEditResultDTO, any>({
        path: `/api/article/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ArticleControllerPublish
     * @request PUT:/api/article/{id}/publish
     * @response `200` `void`
     */
    articleControllerPublish: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/article/${id}/publish`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @name ArticleControllerUnpublish
     * @request PUT:/api/article/{id}/unpublish
     * @response `200` `void`
     */
    articleControllerUnpublish: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/article/${id}/unpublish`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerLogin
     * @request POST:/api/auth/login
     * @response `200` `LoginResultDTO`
     */
    authControllerLogin: (data: LoginDTO, params: RequestParams = {}) =>
      this.request<LoginResultDTO, any>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerInitAdmin
     * @request POST:/api/auth/init-admin
     * @response `200` `void`
     */
    authControllerInitAdmin: (data: LoginDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/init-admin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
