import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BankService } from './bank.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[ BankService ]
})
export class AppComponent {
  title = 'bank-crud';
  constructor(readonly bankService: BankService ){
    this.bankService.getFinancialProducts().subscribe(console.log)
  }
}
