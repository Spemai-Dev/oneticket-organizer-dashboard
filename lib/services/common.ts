import axios from "axios";
import { base_url_new } from "../environment";
import { getToken } from "../auth";

export async function unauth_add(endpoint: string, data: any) {
  try {
    const response = await axios.post(base_url_new + endpoint, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data === 401 || response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return response.data;
  } catch (error) {
    console.error("Error in unauth POST:", error);
    throw error;
  }
}

export async function auth_add(endpoint: string, data: any) {
  try {
    const response = await axios.post(base_url_new + endpoint, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return;
    }

    return response;
  } catch (error: any) {
    console.error("Error in POST request:", error);
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw error;
  }
}

export async function get(endpoint: string) {
  try {
    const response = await axios.get(base_url_new + endpoint, {
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return;
    }

    return response;
  } catch (error: any) {
    console.error("Error in GET request:", error);
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw error;
  }
}

export async function getIpgReportNew(url: string) {
  try {
    const fullUrl = `${base_url_new}${url}`;

    const httpHeaders = {
      "Content-Type": "text/plain",
      Authorization: `Bearer ${getToken()}`,
    };

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: httpHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch the report: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const { value, done: isDone } = await reader.read();
      if (value) {
        chunks.push(value);
      }
      done = isDone;
    }

    const combinedChunks = new Uint8Array(
      chunks.reduce((acc: number[], chunk) => [...acc, ...Array.from(chunk)], [])
    );

    const blob = new Blob([combinedChunks], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = downloadUrl;
    anchor.download = "Report.xlsx";
    document.body.appendChild(anchor);
    anchor.click();

    URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(anchor);
  } catch (error) {
    console.error("Error downloading report:", error);
  }
}
