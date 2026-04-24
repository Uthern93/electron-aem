import { Injectable } from '@angular/core';
import { ChartData } from './auth.service';
const PouchDB = require('pouchdb');

@Injectable({
  providedIn: 'root'
})
export class PouchdbService {

  private db: any;
  private readonly dashboardDocId = 'dashboard_chart_data';

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

  async saveDashboardData(data: ChartData) {
    try {
      const existing = await this.db.get(this.dashboardDocId);

      return this.db.put({
        ...existing,
        _id: this.dashboardDocId,
        data,
        updatedAt: new Date().toISOString(),
      });

    } catch {

      return this.db.put({
        _id: this.dashboardDocId,
        data,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  async getDashboardData(): Promise<ChartData | null> {
    try {
      const doc = await this.db.get(this.dashboardDocId);

      return doc.data ?? null;
      
    } catch {
      return null;
    }
  }
}
