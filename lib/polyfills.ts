// Polyfills for better cross-browser compatibility

// Polyfill for Promise.allSettled (for older browsers)
if (Promise && !Promise.allSettled) {
  Promise.allSettled = function promisesAllSettled<T extends readonly unknown[] | []>(promises: T) {
    return Promise.all(
      (promises as readonly Promise<unknown>[]).map((p) => Promise.resolve(p).then(
        (value) => ({
          status: 'fulfilled' as const,
          value,
        }),
        (reason) => ({
          status: 'rejected' as const,
          reason,
        }),
      )),
    );
  };
}

// Polyfill for Array.prototype.flat (for older browsers)
if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth?: number) {
    const flattend: any[] = [];
    (function flat(array: any[], depthNum: number) {
      for (let el of array) {
        if (Array.isArray(el) && depthNum > 0) {
          flat(el, depthNum - 1);
        } else {
          flattend.push(el);
        }
      }
    })(this as any[], Math.floor(depth || 1));
    return flattend;
  };
}

// Polyfill for Array.prototype.flatMap (for older browsers)
if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback: (value: any, index: number, array: any[]) => any, thisArg?: any) {
    return (this as any[]).map(callback, thisArg).flat(1);
  };
}

declare global {
  interface String {
    replaceAll(
      searchValue: string | RegExp,
      replaceValue: string
    ): string;
    replaceAll(
      searchValue: string | RegExp,
      replacer: (substring: string, ...args: any[]) => string
    ): string;
  }
}

// Polyfill for String.prototype.replaceAll (for older browsers)
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(
    searchValue: string | RegExp,
    replaceValueOrReplacer: string | ((substring: string, ...args: any[]) => string)
  ): string {
    // If a regex pattern
    if (Object.prototype.toString.call(searchValue).toLowerCase() === '[object regexp]') {
      return this.replace(searchValue as RegExp, replaceValueOrReplacer as string);
    }

    // If a string
    if (typeof replaceValueOrReplacer === 'function') {
      // Handle the replacer function case
      const replacer = replaceValueOrReplacer as (substring: string, ...args: any[]) => string;
      return this.replace(new RegExp(searchValue as string, 'g'), function() {
        return replacer.apply(null, arguments as any);
      });
    } else {
      // Handle the string replacement case
      return this.replace(new RegExp(searchValue as string, 'g'), replaceValueOrReplacer as string);
    }
  };
}

// Polyfill for Object.fromEntries (for older browsers)
if (!Object.fromEntries) {
  Object.fromEntries = function(entries: Iterable<readonly [PropertyKey, any]>) {
    if (!entries || !(Symbol.iterator in Object(entries))) {
      throw new Error('Object.fromEntries() requires a single iterable argument');
    }

    const obj: Record<PropertyKey, any> = {};
    for (const [key, value] of entries) {
      obj[key] = value;
    }
    return obj;
  };
}

// Polyfill for Element.prototype.toggleAttribute (for older browsers)
if (typeof Element !== 'undefined' && !Element.prototype.toggleAttribute) {
  Element.prototype.toggleAttribute = function(name: string, force?: boolean) {
    if (force !== undefined) {
      force = !!force;
    }

    if (this.getAttribute(name) !== null) {
      if (force) {
        return true;
      }

      this.removeAttribute(name);
      return false;
    } else {
      if (force === false) {
        return false;
      }

      this.setAttribute(name, '');
      return true;
    }
  };
}

// Polyfill for NodeList.prototype.forEach (for older browsers)
if (typeof window !== 'undefined' && window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function(callback: (value: Node, index: number, nodeList: NodeList) => void, thisArg?: any) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// Polyfill for requestAnimationFrame (for older browsers)
if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).oRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame ||
      function(callback: FrameRequestCallback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  })();
}

// Polyfill for CustomEvent (for older browsers)
if (typeof window !== 'undefined' && typeof window.CustomEvent !== 'function') {
  function CustomEvent<T>(event: string, params: CustomEventInit<T>) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles || false, params.cancelable || false, params.detail);
    return evt;
  }

  window.CustomEvent = CustomEvent as any;
}

// Polyfill for fetch (for older browsers)
// Note: This is a simplified version. In production, you might want to use a more complete polyfill
if (typeof window !== 'undefined' && !window.fetch) {
  window.fetch = function(input: RequestInfo, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.url;
    const options = init || {};
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(options.method || 'GET', url, true);

      // Set headers
      if (options.headers) {
        for (var header in options.headers) {
          xhr.setRequestHeader(header, (options.headers as Record<string, string>)[header]);
        }
      }

      xhr.onload = function() {
        const response = new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: new Headers()
        });
        resolve(response);
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request timed out'));
      };

      const body = options.body as XMLHttpRequestBodyInit | Document | null | undefined;
      xhr.send(body || null);
    });
  } as typeof fetch;
}

// Export an empty object to make this a module
export {};