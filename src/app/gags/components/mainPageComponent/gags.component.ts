import { Component, OnInit  } from '@angular/core';
import { Gag } from '../../../shared/models/gags.interface';
import { GagService } from '../../services/GagService';
import { environment } from '../../../../environments/environment';
import { FilterService } from '../../services/FilterService';
import { Subscription, combineLatest} from 'rxjs';
import { CultureService } from '../../services/CultureService';
import { AuthService } from '../../../authentification/auth.service';


@Component({
  templateUrl: './gags.component.html',
  styleUrls: ['./gags.component.css'],
})
export class GagComponent implements OnInit {

  gags: Gag[] = [];
  loading: boolean = true;
  errorMsg: string | null = null;
  currentShowLaChute: boolean = false;
  currentGagShowLaChute: number | null = null;
  showLaChuteStates: { [key: number]: boolean } = {};
  currentPage: number = 0;
  totalPages: number = 0;
  currentCulture: string = 'MAR';
  roles: string[] = [];
  public userImageSrc: string = 'assets/images/users/user_francais.png';
  private filtersSubscription: Subscription = new Subscription();

  constructor(private gagService: GagService, private authService : AuthService, private filterService: FilterService, private cultureService: CultureService) {
  }

  ngOnInit() {

    this.roles = this.authService.getRoles();
    console.log('User roles:', this.roles);
    this.loading = true;

    this.filtersSubscription = combineLatest([
      this.cultureService.culture$,
      this.filterService.filters$
    ]).subscribe(([culture, filters]) => {
      this.currentCulture = culture;
      console.log('Current culture:', this.currentCulture);
      this.userImageSrc = this.cultureService.getProfilImage();
  
      // Ajouter la culture aux filtres et recharger les blagues
      const updatedFilters = { ...filters, culture: this.currentCulture };
      this.currentPage = 0; // Reset de la pagination
      this.gags = []; // Nettoyer la liste actuelle
      this.loadGags(updatedFilters);
    });
    
    
  }

  ngOnDestroy() {
    if (this.filtersSubscription) {
      this.filtersSubscription.unsubscribe();
    }
  }

  toggleLaChute(gagId: number) {
    this.showLaChuteStates[gagId] = !this.showLaChuteStates[gagId];
  }

  // Check if a specific post is expanded
  isLaChuteShown(gagId: number): boolean {
    return this.showLaChuteStates[gagId] || false;
  }

  loadGags(filters?: { culture: string | null, category: string | null, type: string | null }) {
    this.loading = true;
    this.gagService.getFilteredGags(this.currentPage, environment.gagPageSize, filters?.type, filters?.category, filters?.culture).subscribe({
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

  isAbleToDelete(): boolean {
    return this.roles.includes('ROLE_ADMIN'); // Check if the user has the ADMIN role
  }

  loadGags1() {
    this.loading = true;
    this.gagService.getPaginatedGags(this.currentPage, environment.gagPageSize).subscribe({
      next: (data) => {
        this.gags = this.gags.concat(data.gags);  // Append new gags to existing list
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.errorMsg = 'Failed to load gags';
        console.error(error);
        this.loading = false;
      },
    });
  }

  loadMore() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadGags();  // Load more gags on button click
    }
  }

  deleteJoke(jokeId: number): void {
    this.gagService.deleteJoke(jokeId).subscribe({
      next: () => {
        console.log('Joke deleted successfully');
        // Remove the deleted joke from the list
        this.gags = this.gags.filter((gag) => gag.id !== jokeId);
      },
      error: (err) => {
        console.error('Error deleting joke:', err);
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
