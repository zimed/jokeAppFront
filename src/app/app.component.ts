import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CultureChoiceComponent } from './gags/components/culture-choice/culture-choice.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    if (!localStorage.getItem('selectedCulture')) {
      this.dialog.open(CultureChoiceComponent, { disableClose: true });
    }
  }
}
