import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Veterinaria } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class VeterinariaService {
  private readonly http = inject(HttpClient);

  obtener(): Observable<Veterinaria> {
    return this.http
      .get<ApiResponse<Veterinaria>>(`${environment.apiUrl}/veterinaria`)
      .pipe(map((response) => response.data));
  }
}
