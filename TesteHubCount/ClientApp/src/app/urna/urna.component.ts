import { Observable } from 'rxjs';
import { TotalVotes } from './../../models/TotalVotes';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Vote } from 'src/models/Vote';
import { AlertasService } from '../services/alertas.service';
import { VoteService } from '../services/votes.service';
import { HttpClient } from '@angular/common/http';
import { CandidateService } from '../services/candidates.service';

@Component({
  selector: 'app-urna',
  templateUrl: './urna.component.html',
  styleUrls: ['./urna.component.css']
})
export class UrnaComponent implements OnInit, OnChanges {
  public corrigeInput: any = '';
  @Input() voteCandidatoIdInput: string = '';
  votes!: TotalVotes;
  value: any;
  candidato: any;
  candidatos!: any[];
  votoFinalizado: boolean = false;

  constructor(
    public httpclient: HttpClient,
    private voteService: VoteService,
    private candidateService: CandidateService,
    private alert: AlertasService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    alert("mudou")
    console.log(changes)
  }

  ngOnInit(): void {
    this.getAllCandidates();
  }

  addVote(parametro: string) {
    if (this.votoFinalizado == true) {
      this.reloadCurrentPage();
    }
    else {
      const candidatoId = Number(parametro);
      let vote = new Vote(candidatoId);
      vote.CandidatoId = candidatoId;
      this.voteService.postVote(vote).subscribe((data: any) => {
        vote = data;
        this.trocaTelaVotoFinalizado();

      }, error => {
        console.log(error);
        this.alert.showAlertDanger('Ocorreu um erro no voto');

      });
    }

  }

  addBrancoVote() {
    let vote = new Vote(-2);
    this.voteService.postVote(vote).subscribe((data: any) => {
      vote = data;
      this.trocaTelaVotoFinalizado();
    }, error => {
      console.log(error);
      this.alert.showAlertDanger('Ocorreu um erro no voto');



    });
  }
  getAllCandidates() {
    this.candidateService.getAllCandidates().subscribe((data: any) => {
      this.candidatos = data;
    });
  }

  getByLegendaCandidate(parametro: string) {
    // alert('rodou a busca por candidato')
    if (parametro.length == 2) {
      const legenda = Number(parametro)
      this.candidateService.getByLegendaCandidate(legenda).subscribe((data: any) => {
        this.candidato = data;
      });
    } else { return; }

  }

  corrige() {
    this.voteCandidatoIdInput = ''
    this.candidato = null
  }

  click(x: string) {
    if (this.voteCandidatoIdInput.length < 2) {
      this.voteCandidatoIdInput = this.voteCandidatoIdInput.concat(x.toString());
      this.getByLegendaCandidate(this.voteCandidatoIdInput); return
    }
  }

  trocaTelaVotoFinalizado() {
    let telaVotoFinalizado = document.getElementById('tela')
    telaVotoFinalizado!.innerHTML = '<h1>Voto computado</h1><br><h3>clique CONFIRMA para iniciar novo voto</h3>'
    this.votoFinalizado = true;
  }

  reloadCurrentPage() {
    window.location.reload();
  }






}
