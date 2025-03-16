import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gag } from '../../../shared/models/gags.interface';
import { GagService } from '../../services/GagService';
import { environment } from '../../../../environments/environment';
import { FilterService } from '../../services/FilterService';
import { Subscription, combineLatest} from 'rxjs';
import { CultureService } from '../../services/CultureService';
import { AuthService } from '../../../authentification/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: './gags.component.html',
  styleUrls: ['./gags.component.css'],
})
export class GagComponent implements OnInit {
  username: string | null = null; // To store the username from the route
  isUserPostsView: boolean = false; // Flag to check if it's a user-specific posts view
  gags: Gag[] = [];
  loading: boolean = true;
  errorMsg: string | null = null;
  currentShowLaChute: boolean = false;
  currentGagShowLaChute: number | null = null;
  showLaChuteStates: { [key: number]: boolean } = {};
  currentPage: number = 0;
  totalPages: number = 0;
  updatedFilters: any = {};
  currentCulture: string = 'MAR';
  connectedUser: string | null = null;
  roles: string[] = [];
  public userImageSrc: string = 'assets/images/users/user_francais.png';
  private filtersSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private gagService: GagService,
    private authService : AuthService, 
    private filterService: FilterService, 
    private cultureService: CultureService, 
    private dialog: MatDialog, 
    private toastr: ToastrService) 
    {}

  ngOnInit() {
    this.roles = this.authService.getRoles();
    this.connectedUser = this.authService.getUserNameFromToken();
    this.loading = true;
  
    // Check if the route has a username parameter
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
      if (this.username) {
        this.isUserPostsView = true;
        this.fetchUserPosts(this.username);
      } else {
        this.isUserPostsView = false;
        this.filtersSubscription = combineLatest([
          this.cultureService.culture$,
          this.filterService.filters$
        ]).subscribe(([culture, filters]) => {
          this.currentCulture = culture;
          this.userImageSrc = this.cultureService.getProfilImage();
          this.updatedFilters = { ...filters, culture: this.currentCulture };
          this.currentPage = 0;
          this.gags = [];
          this.loadGags(this.updatedFilters);
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.filtersSubscription) {
      this.filtersSubscription.unsubscribe();
    }
    this.gags = []; // Reset the gags array
  }


  fetchUserPosts(username: string): void {
    this.loading = true;
    this.gagService.getUserPosts(username).subscribe({
      next: (data) => {
        this.gags = data; // Assign the fetched posts to the gags array
        this.loading = false;
        this.errorMsg = null;
      },
      error: (error) => {
        this.errorMsg = 'Failed to load user posts. Please try again later.';
        this.loading = false;
      },
    });
  }



  toggleLaChute(gagId: number) {
    this.showLaChuteStates[gagId] = !this.showLaChuteStates[gagId];
  }

  // Check if a specific post is expanded
  isLaChuteShown(gagId: number): boolean {
    return this.showLaChuteStates[gagId] || false;
  }

  loadGags(filters?: { culture: string | null, category: string | null, type: string | null, status: string | null }) {
    this.loading = true;
    this.gagService.getFilteredGags(this.currentPage, environment.gagPageSize, filters?.type, filters?.category, filters?.culture, filters?.status).subscribe({
      next: (data) => {
        this.gags = this.gags.concat(data.gags);
        console.log("jokes data : ", data);
        this.totalPages = data.totalPages;
        this.loading = false;
        this.errorMsg = null;
        console.log("all gags data : ", this.gags);
      },
      error: (error) => {
        this.errorMsg = 'Failed to load gags';
        console.error(error);
        this.loading = false;
      },
    });
  }

  isAbleToDelete(creator_name : string | undefined): boolean {
    return this.roles.includes('ROLE_ADMIN') || this.connectedUser===creator_name; // Check if the user has the ADMIN role
  }

  isAbleToValidate(){
    return this.roles.includes('ROLE_ADMIN') 
  }

  loadMore() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadGags(this.updatedFilters);
      setTimeout(() => {
        const newJokeElement = document.getElementById(`g${this.gags.length - environment.gagPageSize -1}`);
        console.log("Element exists in the DOM:", newJokeElement);
        if (newJokeElement) {         
          newJokeElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          console.error("Element not found!");
        }
      }, 1000);
    }
  }

  openDeleteConfirmationDialog(jokeId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: { jokeId: jokeId }, // Pass the jokeId to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gags = this.gags.filter((gag) => gag.id !== jokeId);
        this.toastr.success('Joke deleted successfully', 'Success'); // Show success toast
        // Handle UI updates (e.g., remove the joke from the list or navigate away)
      }
      else {
        this.toastr.error('Failed to delete joke', result); // Show error toast
      }
    });
  }


  approuveJoke(jokeId: number): void {
    this.gagService.approuvePost(jokeId).subscribe({
      next: () => {
        console.log('Joke approuved successfully');
        this.gags = this.gags.map((gag) => {
          if (gag.id === jokeId) {
            gag.status = 'APPROVED';
          }
          return gag;
        }); 
        this.toastr.success('Le post selectionné a été approuvé', 'Success');
      },
      error: (err) => {
        console.error('Error, le post n\'a pas été approuvé : ', err);
      },
    });
  }



  isArabic(text: string): boolean {
    // Implement your logic to determine if the text is Arabic
    return false;
  }

  updateShowLachute(gagId: number, show: boolean) {
    this.currentShowLaChute = show;
    this.currentGagShowLaChute = gagId;
  }

  isGagAlreadyLiked(gag: Gag): number {
    // Implement your logic to determine if the gag is already liked
    return 0;
  }

  addLikeOrDislike(gagId: number, isLike: boolean, gag: Gag, index: number) {
    // Implement your like or dislike functionality here
  }

  doAction(actionType: number, index: number | null, gagId: number | null, interactions: any) {
    // Implement your action handling logic here
  }

  diplayMoreGags(): boolean {
    // Implement your logic to determine if more gags should be displayed
    return false;
  }



}
