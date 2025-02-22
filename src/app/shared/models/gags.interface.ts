export interface Gag {
    id: number;
    titreGag: string;
    gagText: string;
    laChute?: string;
    type: string;
    category: string;
    context: string;
    createur_name?: string;
    creation_dateTime: string;
    likes?: number; // Define a more specific type based on your data structure
    disklikes?: number; // Define a more specific type based on your data structure
  }