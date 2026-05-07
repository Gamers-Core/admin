export type PageParams = Record<string, string | null>;
export type PageSearchParams = Record<string, string | null>;

export interface PagePropsWithParams<Params = PageParams> {
  params: Promise<Params>;
}

export interface PagePropsWithSearchParams<SearchParams> {
  searchParams: Promise<SearchParams>;
}

export type PageProps<Params = PageParams, SearchParams = PageSearchParams> = PagePropsWithParams<Params> &
  PagePropsWithSearchParams<SearchParams>;
