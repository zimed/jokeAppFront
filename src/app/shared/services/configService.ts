import { environment } from '../../../environments/environment';

export class ConfigService {
  private apiUrl = environment.apiUrl;
  private pageSize = environment.gagPageSize;

  getApiUrl(): string {
    return this.apiUrl;
  }

  getPageSize(): number {
    return this.pageSize;
  }
}