import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/authentification/auth.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatDialog } from '@angular/material/dialog';
import { CultureChoiceComponent } from 'src/app/gags/components/culture-choice/culture-choice.component';
import { CultureService } from 'src/app/gags/services/CultureService';

declare var $: any;

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgbDropdownModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements AfterViewInit, OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();


  public showSearch = false;
  public isLoggedIn: boolean = false; // Track login status
  public connectedUsername: string | null = null; // Store the connected username
  public userImageSrc: string = '';

  constructor(private modalService: NgbModal, private authService: AuthService, private router : Router, private dialog: MatDialog, private cultureService: CultureService ) {}

  ngOnInit(): void {
    // Initialize login status and user image on component creation
    this.cultureService.culture$.subscribe((culture) => {
      this.userImageSrc = this.cultureService.getProfilImage();
    });
  
    // Subscribe to login status changes
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.connectedUsername = loggedIn ? this.authService.getConnectedUsername() : 'Anonyme';
    });
  }

  // Logout the user
  logout(): void {
    this.authService.logout();
  }

  authentificate(): void {
    this.router.navigate(['/login']);
  }

  displayJokes(): void {  
    this.router.navigate(['/jokes']);
  }

  changeCulture(): void { 
    const dialogRef = this.dialog.open(CultureChoiceComponent, { disableClose: true });
  }

  ngAfterViewInit() {}
}