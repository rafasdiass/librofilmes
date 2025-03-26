export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}
