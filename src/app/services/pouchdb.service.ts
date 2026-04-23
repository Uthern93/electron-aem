import { Injectable } from '@angular/core';
const PouchDB = require('pouchdb');

@Injectable({
  providedIn: 'root'
})
export class PouchdbService {

  private db: any;

  constructor() {
    this.db = new PouchDB.default('users_db');
  }

  async saveUser(user: any) {
    try {
      const existing = await this.db.get(user.username);

      return this.db.put({
        ...existing,
        ...user
      });
      
    } catch {
      return this.db.put({
        _id: user.username,
        ...user
      });
    }
  }

  async getUser(username: string) {
    try {
      return await this.db.get(username);
    } catch {
      return null;
    }
  }
}