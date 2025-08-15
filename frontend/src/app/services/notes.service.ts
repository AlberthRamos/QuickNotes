import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Note {
  id: number;
  texto: string;
  data_criacao: string;
  cliente_id: number;
  usuario_id: number;
  usuario_nome: string;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  data_cadastro: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNotas(clienteId: number): Observable<ApiResponse<Note[]>> {
    return this.http.get<ApiResponse<Note[]>>(`${this.apiUrl}/clientes/${clienteId}/notas`);
  }

  criarNota(clienteId: number, texto: string, usuarioId: number): Observable<ApiResponse<Note>> {
    return this.http.post<ApiResponse<Note>>(`${this.apiUrl}/clientes/${clienteId}/notas`, {
      texto,
      usuario_id: usuarioId
    });
  }

  getClientes(): Observable<ApiResponse<Cliente[]>> {
    return this.http.get<ApiResponse<Cliente[]>>(`${this.apiUrl}/clientes`);
  }

  getUsuarios(): Observable<ApiResponse<Usuario[]>> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.apiUrl}/usuarios`);
  }
}