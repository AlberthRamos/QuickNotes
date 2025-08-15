import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotesService, Note, Cliente } from '../../services/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {
  notas: Note[] = [];
  clientes: Cliente[] = [];
  selectedCliente: number | null = null;
  loading = false;

  constructor(
    private notesService: NotesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClientes();
    this.loadNotes();
  }

  loadClientes(): void {
    this.notesService.getClientes().subscribe({
      next: (response) => {
        this.clientes = response.data;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar clientes', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadNotes(): void {
    this.loading = true;
    
    if (this.selectedCliente) {
      this.notesService.getNotas(this.selectedCliente).subscribe({
        next: (response) => {
          this.notas = response.data;
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao carregar notas', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      // Load all notes from all clients (would need a different endpoint)
      // For now, just show empty
      this.notas = [];
      this.loading = false;
    }
  }

  getClienteName(clienteId: number): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente desconhecido';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}