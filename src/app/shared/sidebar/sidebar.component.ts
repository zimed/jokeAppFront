import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgIf } from '@angular/common';
import { FilterService } from '../../gags/services/FilterService';
import { SharedUIObjectsService } from 'src/app/gags/services/SharedUIObjectsService';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports:[RouterModule, CommonModule, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  cultures: string[] = ['MAROCAINE', 'FRANÇAISE', 'International']; // Example cultures
  categories: string[] = ['IRONIE', 'SARCASME', 'HUMOUR NOIR']; // Example categories
  types: string[] = ['Devinette', 'Blague']; // Example types

  selectedCulture: string | null = null;
  selectedCategory: string | null = null;
  selectedType: string | null = null;

  isFiltersVisible: boolean = false; 

  constructor(private filterService: FilterService, private router: Router, private sharedUIObjectService : SharedUIObjectsService) {}




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

    const categorieMapping: { [key: string]: string } = {
      'IRONIE': 'IRONIE',
      'SARCASME': 'SARCASM',
      'HUMOUR NOIR': 'DARK_HUMOR'
    };
  
    const typeMapping: { [key: string]: string } = {
      'Devinette': 'DEVINETTE',
      'Blague': 'JOKE',
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
      type: mappedType
    });
  
    // Call your service to fetch filtered jokes here (if needed)
  }
}
