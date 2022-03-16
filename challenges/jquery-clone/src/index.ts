import * as nodeFetch from "node-fetch";
import * as querystring from 'querystring';

class SelectorResult {
  #elements: NodeListOf<Element>;
  constructor(elements: NodeListOf<Element>) {
    this.#elements = elements;
  }
  html(contents: string) {
    this.#elements.forEach((e) => {
      e.innerHTML = contents;
    });
  }
}

function $(selector: string) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return null;
  return new SelectorResult(elements);
}

module $ {
  type JSONPrimitive = string | number | boolean | null;
  type JSONObject = { [member: string]: JSONValue };
  type JSONArray = JSONValue[];
  type JSONValue = JSONPrimitive | JSONObject | JSONArray;

  export interface AjaxInfo {
    url: string;
    data: Record<string, string>;
    success?: (resp: unknown) => void,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  }
  export function ajax(
    requestInfo: AjaxInfo,
  ): Promise<unknown> {
    const { url, data, success, method = 'GET' } = requestInfo;
    const fullUrl = method === 'GET' ? `${url}?${new URLSearchParams(data).toString()}` : url;
    console.log({ fullUrl })
    const init: nodeFetch.RequestInit = method === 'GET' ? {} : {body: JSON.stringify(data)}
    return nodeFetch.default(fullUrl, init).then((resp) => {
      return resp.json().then((data: unknown) => {
        success && success(data);
        return data;
      });
    });
  }
}

export default $;
