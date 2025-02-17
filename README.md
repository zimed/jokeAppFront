# XtremeAdminAngularLite

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

######## add slider menu   
create a newmenu.ts file with the same struxture as app>shared>sidebar>menu-items.ts
go to app>shared>sidebar>sidebar.component.ts  and update the function toggleSidebarnav(itemType: string)
then update the sidebar.componenet.html

for now we have the slide, next step is to create the page and the link with the slider


Create a diroctory under app with the name of the formation module, exemple : testModule
then create module.ts linked to a rooting file that linked the path with the compoenet that is going to be subject of the module, exemple app>testmodule>presentation

then not to forget update the app-routing.module.ts and the structure we have mainy declared 

