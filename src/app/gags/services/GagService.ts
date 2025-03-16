import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Gag } from '../../shared/models/gags.interface';
import { PaginatedGagResponse, GagResponse } from '../../shared/models/operational.objects.interfaces';
import { timeAgo } from 'src/app/shared/services/utilsService';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GagService {
  private apiUrl = environment.apiUrl +'/api';

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

  getFilteredGags(page: number,size: number,type?: string | null,category?: string | null,culture?: string | null, status?: string | null ): Observable<{ gags: Gag[], totalPages: number }> {
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
    if (status) {
      params = params.set('status', status);
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
          status: joke.status
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

  getUserPosts(username: string): Observable<Gag[]> {
    const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Make the GET request to fetch all posts for the user
    return this.http.get<GagResponse[]>(`${this.apiUrl}/user/${username}`, { headers }).pipe(
      map((responseArray) =>
        responseArray.map((response) => ({
          id: response.id,
          titreGag: response.title,
          gagText: response.textBody,
          laChute: response.punchline || '',
          createur_name: response.user?.username || 'Unknown',
          creation_dateTime: timeAgo(response.creationTime),
          likes: response.likes,
          dislikes: response.dislikes,
          type: response.type,
          category: response.category,
          context: response.context,
          status: response.status
        }))
      )
    );
  }


  getGag(jokeId: string): Observable<Gag> {
    const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Make the GET request to fetch a single joke
    return this.http.get<GagResponse>(`${this.apiUrl}/gags/${jokeId}`, { headers }).pipe(
      map((response) => ({
        id: response.id,
        titreGag: response.title,
        gagText: response.textBody,
        laChute: response.punchline || '',
        createur_name: response.user?.username || 'Unknown',
        creation_dateTime: timeAgo(response.creationTime),
        likes: response.likes,
        dislikes: response.dislikes,
        type: response.type,
        category: response.category,
        context: response.context,
        status: response.status
      }))
    );
  }


  approuvePost(jokeId: number): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/approve/` + jokeId, {}, { headers });
  }

  updateJoke(jokeId: number, updatedJoke: any): Observable<Gag> {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.put<Gag>(`${this.apiUrl}/updateJoke/${jokeId}`, updatedJoke, { headers });
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
