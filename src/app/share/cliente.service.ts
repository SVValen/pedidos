import { Injectable } from '@angular/core';
import { Observable, ObservableLike, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Cliente } from './cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = 'http://localhost:8888/clientes.php';

  constructor(
    private http: HttpClient,
  ) { }

  get(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url)
            .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete
      (`${this.url}/${id}`)
        .pipe(catchError(this.handleError));
  }

  put(cliente: Cliente): Observable<any> {
    let payload = JSON.stringify(Cliente);
    return this.http.put<Cliente>(this.url, payload)
      .pipe(catchError(this.handleError))
  }

  post(cliente: Cliente): Observable<any> {
    let payload = JSON.stringify(Cliente);
    return this.http.post<Cliente>(this.url, payload)
      .pipe(catchError(this.handleError))
  }



  handleError(err: Response) {
    alert(err.statusText);
    return of([]);
  }
}
