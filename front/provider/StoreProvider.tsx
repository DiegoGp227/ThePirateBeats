"use client";

import apiClient from "@/src/shared/services/apiClient";
import type { AxiosResponse } from "axios";
import { ReactNode } from "react";
import { SWRConfig } from "swr";

const fetcher = (url: string) =>
  apiClient.get<unknown>(url).then((res: AxiosResponse<unknown>) => res.data);

export const SWRProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SWRConfig value={{ fetcher }}>
      {children}
    </SWRConfig>
  );
};
