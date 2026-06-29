import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export interface Maestro {
  id?:        number;
  nombre:     string;
  oficio:     string;
  telefono:   string;
  email:      string;
  rating:     number;
  disponible: boolean;
}

export interface Solicitud {
  id?:          number;
  clienteEmail: string;
  maestroId:    number;
  descripcion:  string;
  estado:       string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':                'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  // URL Mock Server Postman — TengoUnDato API
  apiURL = 'https://9938eb81-da29-451a-8b49-31f768629e44.mock.pstmn.io';

  constructor(private http: HttpClient) {}

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  // ── MAESTROS ───────────────────────────────────────────────────────────────

  getMaestros(): Observable<Maestro[]> {
    return this.http.get<Maestro[]>(`${this.apiURL}/maestros`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getMaestro(id: number): Observable<Maestro> {
    return this.http.get<Maestro>(`${this.apiURL}/maestros/${id}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  createMaestro(maestro: Maestro): Observable<Maestro> {
    return this.http.post<Maestro>(
      `${this.apiURL}/maestros`,
      JSON.stringify(maestro),
      this.httpOptions
    ).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  updateMaestro(id: number, maestro: Maestro): Observable<Maestro> {
    return this.http.put<Maestro>(
      `${this.apiURL}/maestros/${id}`,
      JSON.stringify(maestro),
      this.httpOptions
    ).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  deleteMaestro(id: number): Observable<Maestro> {
    return this.http.delete<Maestro>(
      `${this.apiURL}/maestros/${id}`,
      this.httpOptions
    ).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // ── SOLICITUDES ───────────────────────────────────────────────────────────

  getSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiURL}/solicitudes`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  createSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(
      `${this.apiURL}/solicitudes`,
      JSON.stringify(solicitud),
      this.httpOptions
    ).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  deleteSolicitud(id: number): Observable<Solicitud> {
    return this.http.delete<Solicitud>(
      `${this.apiURL}/solicitudes/${id}`,
      this.httpOptions
    ).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
}