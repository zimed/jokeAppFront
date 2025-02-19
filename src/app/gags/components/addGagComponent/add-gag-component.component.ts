import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GagService } from '../../services/GagService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-gag-component',
  templateUrl: './add-gag-component.component.html',
  styleUrls: ['./add-gag-component.component.scss']
})
export class AddGagComponentComponent implements OnInit {
  addTextGagForm!: FormGroup;
  errorCreation: string | null = null;
  cultures = ['MAROCAINE', 'FRANÇAISE'];
  types = ['Devinette', 'Blague'];
  categories = ['IRONIE', 'SARCASME', 'HUMOUR NOIR'];

  constructor(private formBuilder: FormBuilder, private gagService: GagService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.addTextGagForm = this.formBuilder.group({
      titre: ['', Validators.maxLength(80)],
      gagContenu: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      laChute: ['', Validators.maxLength(400)],
      culture: ['', Validators.required],
      type: ['', Validators.required],
      selectedCategory: [null, Validators.required] // Single selected category
    });
  }

  // Handle category selection
  public selectCategory(category: string): void {
    this.addTextGagForm.get('selectedCategory')?.setValue(category);
  }

  // Handle form submission
  public onClickSendText(): void {
    if (this.addTextGagForm.valid) {
      const payload = this.buildPayload();
      this.sendJokeToBackend(payload);
    } else {
      this.errorCreation = 'Veuillez remplir correctement le formulaire.';
    }
  }

  // Build the API payload from the form data
  private buildPayload(): any {
    const cultureMapping: { [key: string]: string } = {
      'MAROCAINE': 'MAR',
      'FRANÇAISE': 'FR'
    };

    const categorieMapping: { [key: string]: string } = {
      'IRONIE': 'IRONIE',
      'SARCASME': 'SARCASM',
      'HUMOUR NOIR': 'DARK_HUMOR'
    };

    const typeMapping: { [key: string]: string } = {
      'Devinette': 'DEVINETTE',
      'Blague': 'JOKE',
    };

    return {
      title: this.addTextGagForm.value.titre,
      textBody: this.addTextGagForm.value.gagContenu,
      type: typeMapping[this.addTextGagForm.value.type],
      category: categorieMapping[this.addTextGagForm.value.selectedCategory],
      culture: cultureMapping[this.addTextGagForm.value.culture],
      punchline: this.addTextGagForm.value.laChute,
      likes: 0,
      dislikes: 0
    };
  }

  private sendJokeToBackend(payload: any): void {
    this.gagService.addGag(payload).subscribe({
      next: (response) => {
        console.log('Joke added successfully:', response);
        this.toastr.success('Hello world!', 'Success');
      },
      error: (error) => {
        console.error('Error adding joke:', error);
        this.errorCreation = 'Une erreur est survenue lors de l\'ajout de la blague.';
        this.toastr.error('Something went wrong!', 'Error');
      }
    });
  }
}