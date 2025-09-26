import { cookies } from "next/headers";

const baseUrl = process.env.API_URL;

async function get(url: string) {
  const requestOptions = {
    method: "GET",
    headers: await getHeaders(),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
}

async function patch(url: string, body: unknown) {
  const requestOptions = {
    method: "PATCH",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
}

async function post(url: string, body: unknown) {
  const requestOptions = {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
}

async function postWithoutBody(url: string) {
  const requestOptions = {
    method: "POST",
    headers: await getHeaders(),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
}

async function del(url: string) {
  const requestOptions = {
    method: "DELETE",
    headers: await getHeaders(),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
}

export async function handleResponse(response: Response) {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (response.ok) {
    return data || response.statusText;
  } else {
    const error = {
      status: response.status,
      message: typeof data === "string" ? data : response.statusText,
    };
    return { error };
  }
}

async function getHeaders(): Promise<Headers> {
  const jwtToken = (await cookies()).get("jwtToken")?.value;
  const headers = new Headers();
  headers.set("Content-type", "application/json");
  if (jwtToken) {
    headers.set("Authorization", "Bearer " + jwtToken);
  }
  return headers;
}

export const fetchWrapper = {
  get,
  post,
  postWithoutBody,
  patch,
  del,
};
