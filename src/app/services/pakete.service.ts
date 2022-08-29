import { Injectable } from '@angular/core';
import { merge } from 'highcharts';
import { Paket } from '../objekte/paket.model'
import { Stapel } from '../objekte/stapel.model';
import { CardsService } from './cards.service';
import { Card } from '../objekte/card/card.model';

@Injectable({
  providedIn: 'root'
})
export class PaketeService {

  constructor(
    private cardsService: CardsService
  ) { }

  getPakete(): Paket[] {

    let pakete: Paket[] = []

    let cards = this.cardsService.getCards()
    let aktivePakete = this.getAktivePakete()

    for (let card of cards) {
      let p = card.paket
      let paket: Paket = { 'name': p[0], 'stapel': [] }
      if (aktivePakete.includes(paket.name))
        paket.aktiv = true;


      for (let i = p.length - 1; i > 0; i--) {

        let newStapel = { name: p[i], stapel: paket.stapel }
        paket.stapel = [newStapel]
      }
      pakete = this.merge(pakete, paket)
    }

    console.log(pakete)
    return pakete

  }

  getActiveCards(): Card[] {
    let aktivePakete = this.getAktivePakete()
    return this.cardsService.getCards().filter((card) => {
      if (aktivePakete.includes(card.paket[0]))
        return true
      return false
    })
  }

  merge(pakete: Paket[], paket: Paket) {
    let ps: Paket[] = []

    for (let p of pakete) {
      if (p.name != paket.name) {
        ps.push(p)
        continue;
      }
      p.stapel = this.mergeStapel(p.stapel, paket.stapel)
      ps.push(p)
      return ps
    }
    ps.push(paket)

    return ps
  }
  mergeStapel(stapel1: Stapel[], stapel2: Stapel[]): Stapel[] {
    let stapel: Stapel[] = []
    for (let i = 0; i < stapel2.length; i++) {
      let ps: Stapel[] = []

      for (let p of stapel1) {
        if (p.name != stapel2[i].name) {
          ps.push(p)
          continue;
        }
        p.stapel = this.mergeStapel(p.stapel, stapel2[i].stapel)
        ps.push(p)
        return ps
      }
      ps.push(stapel2[i])

      return ps
    }
    return stapel
  }
  getPaketeAsString() {
    let p: string[] = [];
    let cards = this.cardsService.getCards()
    for (let c of cards) {
      p.push(c.paket.reduce((paket, e) => {
        return paket += '::' + e
      }))
    }
    return [... new Set(p)] //TODO: Stapel ergänzen

  }

  getAktivePakete(): string[] {
    return JSON.parse(localStorage.getItem('aktivePakete') || '[]')
  }
  setAktivePakete(pakete: string[]) {
    localStorage.setItem('aktivePakete', JSON.stringify(pakete))
  }

}
