import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Gag } from '../../shared/models/gags.interface';
import { PaginatedGagResponse, GagResponse } from '../../shared/models/operational.objects.interfaces';
import { timeAgo } from 'src/app/shared/services/utilsService';

@Injectable({
  providedIn: 'root',
})
export class GagService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getGags(): Observable<Gag[]> {
    return this.http.get<any[]>(this.apiUrl + '/allgags').pipe(
      map((data) =>
        data.map((joke) => ({
          id: joke.id,
          titreGag: joke.title,
          gagText: joke.textBody,
          laChute: joke.punchline || '',
          createur_name: joke.user?.username || 'Unknown',
          creation_dateTime: joke.creationTime,
          likes: joke.likes,
          dislikes: joke.dislikes,
          type: joke.type,
          category: joke.category,
          context: joke.context,
        }))
      )
    );
  }

  
  // Fetch paginated gags
  getPaginatedGags(page: number, size: number): Observable<{ gags: Gag[], totalPages: number }> {
    const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

    return this.http.get<PaginatedGagResponse>(this.apiUrl + '/gags', { params }).pipe(
      map((response) => ({
        gags: response.content.map((joke) => ({
          id: joke.id,
          titreGag: joke.title,
          gagText: joke.textBody,
          laChute: joke.punchline || '',
          createur_name: joke.user?.username || 'Unknown',
          creation_dateTime: joke.creationTime,
          likes: joke.likes,
          dislikes: joke.dislikes,
          type: joke.type,
          category: joke.category,
          context: joke.context,
        })),
        totalPages: response.totalPages,
      }))
    );
  }

  getFilteredGags(page: number,size: number,type?: string | null,category?: string | null,culture?: string | null): Observable<{ gags: Gag[], totalPages: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    if (type) {
      params = params.set('type', type);
    }
    if (category) {
      params = params.set('category', category);
    }
    if (culture) {
      params = params.set('culture', culture);
    }
  
    // Make the HTTP request and transform the response
    return this.http.get<PaginatedGagResponse>(`${this.apiUrl}/filteredGags`, { params }).pipe(
      map((response) => ({
        gags: response.content.map((joke) => ({
          id: joke.id,
          titreGag: joke.title,
          gagText: joke.textBody,
          laChute: joke.punchline || '',
          createur_name: joke.user?.username || 'Unknown',
          creation_dateTime: timeAgo(joke.creationTime),
          likes: joke.likes,
          dislikes: joke.dislikes,
          type: joke.type,
          category: joke.category,
          context: joke.context,
        })),
        totalPages: response.totalPages,
      }))
    );
  }


  addGag(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/addJoke`, payload, { headers });
  }


  deleteJoke(jokeId: number): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.request('DELETE', `${this.apiUrl}/deleteJoke/${jokeId}`, {
      headers
    });
  }




}
