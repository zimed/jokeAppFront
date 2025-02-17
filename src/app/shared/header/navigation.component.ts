import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/authentification/auth.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgbDropdownModule, CommonModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements AfterViewInit, OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();


  public showSearch = false;
  public isLoggedIn: boolean = false; // Track login status
  public connectedUsername: string | null = null; // Store the connected username

  constructor(private modalService: NgbModal, private authService: AuthService, private router : Router) {}

  ngOnInit(): void {
    // Subscribe to login status changes
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      console.log('logged in', loggedIn);
      if (loggedIn) {
        this.connectedUsername = this.authService.getConnectedUsername(); // Get the connected username
      } else {
        this.connectedUsername = "Anonyme"; // Clear the username on logout
      }
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

  ngAfterViewInit() {}
}