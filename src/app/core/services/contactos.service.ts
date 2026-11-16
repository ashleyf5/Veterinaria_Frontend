import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';

export interface ContactoPayload {
  nombre: string;
  correo: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class ContactosService {
  private readonly http = inject(HttpClient);

  enviar(contacto: ContactoPayload): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(
      `${environment.apiUrl}/contactos`,
      contacto,
    );
  }
}
