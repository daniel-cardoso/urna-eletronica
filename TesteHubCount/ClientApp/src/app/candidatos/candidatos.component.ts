import { Candidate } from './../../models/Candidate';
import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../services/candidates.service';
import { AlertasService } from '../services/alertas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent implements OnInit {
  candidatos: any[] = [];
  public form!: FormGroup;

  nome!: string;
  vice!: string;
  legenda!: number;
  data: Date = new Date();
  candidato: Candidate = new Candidate(this.nome, this.vice, this.data, this.legenda);
  testeid!: number;
  constructor(
    private candidateService: CandidateService,
    private alert: AlertasService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required,
        Validators.pattern("^[a-zA-Z áãâéêíóôõú]{6,20}$")
      ])],
      vice: ['', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required,
        Validators.pattern("^[a-zA-Z áãâéêíóôõú]{6,20}$")
      ])],
      legenda: ['', Validators.compose([
        Validators.min(1),
        Validators.max(99),
        Validators.required,
        Validators.pattern("^[1-9][0-9]$")
      ])]


    });
   }

  ngOnInit(): void {
    this.getAllCandidates();


  }

  getAllCandidates() {
    this.candidateService.getAllCandidates().subscribe((data: any) => {
      this.candidatos = data;
    });
  }

  getByIdCandidate(id: number) {
    this.testeid = id;
    this.candidateService.getByLegendaCandidate(id).subscribe((data: any) => {
      this.candidatos = data;
    });
  }

  putCandidate(id: number, candidato: Candidate) {
    this.candidateService.putCandidate(this.testeid, candidato).subscribe((data: any) => {
      this.candidato = data;
      this.alert.showAlertSuccess('Candidato editado com sucesso!')
      this.getAllCandidates();
    },error => {
      console.log(error);
      this.alert.showAlertDanger('Ocorreu um erro no cadastro do candidato, lembre que todos são obrigatórios');


    });
  }

  remove(id: number) {
    this.candidateService.deleteCandidate(id).subscribe(() => {
      this.alert.showAlertSuccess('Candidato apagado com sucesso!')
      this.getAllCandidates();

    })
  }

}
