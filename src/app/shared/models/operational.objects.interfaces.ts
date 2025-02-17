    export interface GagResponse {
      id: number;
      title: string;
      textBody: string;
      punchline?: string;
      user?: {
        username: string;
      };
      likes: number;
      dislikes: number;
      type: string;
      category: string;
      context: string;
    }

    export interface PaginatedGagResponse {
      content: GagResponse[];
      totalPages: number;
    }