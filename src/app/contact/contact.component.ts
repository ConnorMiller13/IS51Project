import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  movies: Array<Contact> = [];
  contactParams = '';
  apiURL = '';
  apiKey = '';
  constructor(private http: Http) {

    this.apiURL = environment.apiURL;
   }


  async ngOnInit() {
    this.loadMovies();
  }
  async loadMovies() {
    const savedMovies = this.getItemsFromLocalStorage('contacts');
    if (savedMovies && savedMovies.length > 0) {
      this.movies = savedMovies;
    } else {
      this.movies = await this.loadItemsFromFile();
    }
    this.sortByID(this.movies);
  }
  async loadItemsFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    return data.json();
  }

  addMovies() {
    this.movies.unshift(new Contact({}));
  }

  deleteMovies(index: number) {
    this.movies.splice(index, 1);
    this.saveItemsToLocalStorage(this.movies);
  }

  saveMovies(contact: any) {
    contact.editing = false;
    this.saveItemsToLocalStorage(this.movies);
  }

  saveItemsToLocalStorage(movies: Array<Contact>) {
    movies = this.sortByID(movies);
    const savedMovies = localStorage.setItem('contacts', JSON.stringify(movies));
    return savedMovies;
  }

  getItemsFromLocalStorage(key: string) {
    const savedContacts = JSON.parse(localStorage.getItem(key));
    return savedContacts;
  }

  searchMovies(params: string) {
    this.movies = this.movies.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;

      if (params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }
    });
  }

  sortByID(contacts: Array<Contact>) {
    contacts.sort((prevContact: Contact, presContact: Contact) => {
      return prevContact.id > presContact.id ? 1 : -1;
    });
    return contacts;
  }
}
