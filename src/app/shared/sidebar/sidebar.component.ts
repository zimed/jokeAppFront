import { Component, AfterViewInit, OnInit, NgModule  } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgIf } from '@angular/common';
import { FilterService } from '../../gags/services/FilterService';
import { SharedUIObjectsService } from 'src/app/gags/services/SharedUIObjectsService';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from 'src/app/authentification/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports:[RouterModule, CommonModule, NgIf, FormsModule], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  categories: string[] = ['ALL','IRONIE', 'SARCASME', 'HUMOUR NOIR', 'HUMOUR ABSURDE', 'JEUX DE MOTS']; // Example categories
  types: string[] = ['ALL', 'Devinette', 'Blague', 'Story']; // Example types
  statusOption: string = 'PENDING';  
  selectedCulture: string | null = null;
  selectedCategory: string | null = null;
  selectedType: string | null = null;

  isFiltersVisible: boolean = false; 
  roles: string[] = [];

  constructor(private filterService: FilterService, private router: Router, private authService : AuthService, private sharedUIObjectService : SharedUIObjectsService) {}

  ngOnInit() {
    this.roles = this.authService.getRoles();
  }

  isAbleToFilterStatus(): boolean {
    return this.roles.includes('ROLE_ADMIN')
  }

  navigateToAddGag(): void {
    this.sharedUIObjectService.updateShowSecondaryMenu(false);
    this.router.navigate(['/jokes/add']); // Navigate to the specified route
  }



  /***************************   filter Action   ************************************** */

  // Toggle filter visibility
  toggleFilters(): void {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  // Handle culture selection
  selectCulture(culture: string): void {
    this.selectedCulture = this.selectedCulture === culture ? null : culture;
  }

  // Handle category selection
  selectCategory(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? null : category;
  }

  // Handle type selection
  selectType(type: string): void {
    this.selectedType = this.selectedType === type ? null : type;
  }

  // Apply filters
  applyFilters(): void {
    this.router.navigate(['/jokes']);

    const categorieMapping: { [key: string]: string | null } = {
      'ALL': null,
      'IRONIE': 'IRONIE',
      'SARCASME': 'SARCASM',
      'HUMOUR NOIR': 'DARK_HUMOR',
      'HUMOUR ABSURDE': 'ABSURDE_HUMOR',
      'JEUX DE MOTS': 'WORD_PLAY'
    };
  
    const typeMapping: { [key: string]: string | null } = {
      'ALL': null,
      'Devinette': 'DEVINETTE',
      'Blague': 'JOKE',
      'Story': 'STORY'
    };
  
    // Map the selected values to their corresponding mapped values

    const mappedCategory = this.selectedCategory ? categorieMapping[this.selectedCategory] : null;
    const mappedType = this.selectedType ? typeMapping[this.selectedType] : null;
  
    console.log('Selected Filters:', {
      category: mappedCategory,
      type: mappedType
    });
    
    // Update the filters in the shared service
    this.filterService.updateFilters({
      culture: localStorage.getItem('selectedCulture'),
      category: mappedCategory,
      type: mappedType,
      status : this.statusOption
    });
    this.sharedUIObjectService.updateShowSecondaryMenu(false);
  
    // Call your service to fetch filtered jokes here (if needed)
  }
}
