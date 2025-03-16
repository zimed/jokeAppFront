import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GagService } from '../../services/GagService';
import { Gag } from '../../../shared/models/gags.interface';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../authentification/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CultureService} from '../../services/CultureService';
import { timeAgo } from 'src/app/shared/services/utilsService';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-single-gag',
  templateUrl: './single-gag.component.html',
  styleUrls: ['./single-gag.component.scss'],
})
export class SingleGagComponent implements OnInit {
  jokeId : string | null = null;
  gag: Gag | null = null;
  loading: boolean = true;
  errorMsg: string | null = null;
  showLaChute: boolean = false;
  connectedUser: string | null = null;
  roles: string[] = [];
  userImageSrc: string = 'assets/images/users/user_francais.png';
  isEditMode: boolean = false; // Toggle between view and edit modes
  editGagForm: FormGroup; // Form for editing the joke
  types = ['Devinette', 'Blague', 'Story']; // Types of jokes
  categories = ['IRONIE', 'SARCASME', 'HUMOUR NOIR', 'HUMOUR ABSURDE', 'JEUX DE MOTS']; // Categories of jokes
  culture = localStorage.getItem('selectedCulture');

  constructor(
    private route: ActivatedRoute,
    private gagService: GagService,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cultureService: CultureService, 
    private dialog: MatDialog,
    private rooter: Router
  ) {
    // Initialize the form
    this.editGagForm = this.fb.group({
      titre: ['', Validators.maxLength(80)],
      gagContenu: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
      laChute: ['', Validators.maxLength(400)],
      type: ['', Validators.required],
      selectedCategory: [null], // Single selected category
    });
  }

  ngOnInit(): void {
    this.roles = this.authService.getRoles();
    this.connectedUser = this.authService.getUserNameFromToken();
    this.userImageSrc = this.getUserImageSrc();

    this.jokeId = this.route.snapshot.paramMap.get('id');
    if (this.jokeId) {
      this.fetchPost(this.jokeId);
    } else {
      this.errorMsg = 'Invalid joke ID';
      this.loading = false;
    }
  }

  fetchPost(jokeId: string): void {
    this.gagService.getGag(jokeId).subscribe(
      (response) => {
        this.gag = response;
        this.loading = false;
        this.populateForm(response); // Populate the form with the joke data
      },
      (error) => {
        this.errorMsg = 'Failed to load the joke. Please try again later.';
        this.loading = false;
      }
    );
  }

  populateForm(gag: Gag): void {
    const typeMapping: { [key: string]: string } = {
      DEVINETTE: 'Devinette',
      JOKE: 'Blague',
      STORY: 'Story',
    };

    const categoryMapping: { [key: string]: string } = {
      IRONIE: 'IRONIE',
      SARCASM: 'SARCASME',
      DARK_HUMOR: 'HUMOUR NOIR',
      ABSURDE_HUMOR: 'HUMOUR ABSURDE',
      WORD_PLAY: 'JEUX DE MOTS',
    };

    this.editGagForm.patchValue({
      titre: gag.titreGag,
      gagContenu: gag.gagText,
      laChute: gag.laChute,
      type: typeMapping[gag.type],
      selectedCategory: categoryMapping[gag.category],
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  selectCategory(category: string): void {
    this.editGagForm.get('selectedCategory')?.setValue(category);
  }

  onSubmit(): void {
    if (this.editGagForm.invalid || !this.gag) {
      return;
    }

    const updatedJoke = this.buildPayload();
    this.gagService.updateJoke(this.gag.id, updatedJoke).subscribe({
      next: (response) => {
        this.gag = response; // Update the displayed joke
        this.isEditMode = false; // Exit edit mode
        this.toastr.success('Joke updated successfully', 'Success');
        this.rooter.navigate(['/posts']);
      },
      error: (error) => {
        this.toastr.error('Failed to update joke', 'Error');
        console.error('Error updating joke:', error);
      },
    });
  }

  buildPayload(): any {
    const categorieMapping: { [key: string]: string | null } = {
      IRONIE: 'IRONIE',
      SARCASME: 'SARCASM',
      'HUMOUR NOIR': 'DARK_HUMOR',
      'HUMOUR ABSURDE': 'ABSURDE_HUMOR',
      'JEUX DE MOTS': 'WORD_PLAY',
    };

    const typeMapping: { [key: string]: string } = {
      Devinette: 'DEVINETTE',
      Blague: 'JOKE',
      Story: 'STORY',
    };

    this.cultureService.culture$.subscribe((culture) => {
      this.culture = this.cultureService.getCulture();
    });

    return {
      id : this.jokeId,
      title: this.editGagForm.value.titre,
      textBody: this.editGagForm.value.gagContenu,
      type: typeMapping[this.editGagForm.value.type],
      category: categorieMapping[this.editGagForm.value.selectedCategory],
      culture: this.culture,
      punchline: this.editGagForm.value.laChute,
    };
  }

  toggleLaChute(): void {
    this.showLaChute = !this.showLaChute;
  }

  isArabic(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text);
  }

  isAbleToUpdate(creator_name: string | undefined): boolean {
    return this.roles.includes('ROLE_ADMIN') || (this.gag?.createur_name === this.connectedUser && this.gag?.status !== 'APPROVED');
  }

  isAbleToDelete(creator_name: string | undefined): boolean {
    return this.roles.includes('ROLE_ADMIN') || (this.connectedUser === creator_name);
  }

  isAbleToValidate(): boolean {
    return this.roles.includes('ROLE_ADMIN');
  }

  openDeleteConfirmationDialog(jokeId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: { jokeId: jokeId }, // Pass the jokeId to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rooter.navigate(['/posts']); // Redirect to the gags page
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
        this.toastr.success('Joke approved successfully', 'Success');
        if (this.gag) {
          this.gag.status = 'APPROVED';
        }
      },
      error: (err) => {
        this.toastr.error('Failed to approve joke', 'Error');
        console.error('Error approving joke:', err);
      },
    });
  }

  getUserImageSrc(): string {
    return 'assets/images/users/user_francais.png'; // Example
  }
}