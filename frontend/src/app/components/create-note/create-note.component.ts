import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotesService, Cliente, Usuario } from '../../services/notes.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.css']
})
export class CreateNoteComponent implements OnInit {
  noteForm: FormGroup;
  clientes: Cliente[] = [];
  usuarios: Usuario[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private notesService: NotesService,
    private snackBar: MatSnackBar
  ) {
    this.noteForm = this.fb.group({
      cliente_id: ['', Validators.required],
      usuario_id: ['', Validators.required],
      texto: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
    this.loadUsuarios();
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

  loadUsuarios(): void {
    this.notesService.getUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response.data;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      this.loading = true;
      const { cliente_id, texto, usuario_id } = this.noteForm.value;

      this.notesService.criarNota(cliente_id, texto, usuario_id).subscribe({
        next: (response) => {
          this.snackBar.open('Nota criada com sucesso!', 'Fechar', { duration: 3000 });
          this.noteForm.reset();
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao criar nota', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}