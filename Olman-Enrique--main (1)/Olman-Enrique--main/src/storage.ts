/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Report } from './types';

const STORAGE_KEY = 'mep_reports';
const COLLECTION_NAME = 'reports';

export const storage = {
  // Local Storage Fallback
  saveLocal: (report: Report) => {
    const reports = storage.getLocalReports();
    const index = reports.findIndex(r => r.id === report.id);
    if (index >= 0) {
      reports[index] = report;
    } else {
      reports.push(report);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  getLocalReports: (): Report[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Firestore Methods
  saveReport: async (report: Report, userId?: string) => {
    const path = `${COLLECTION_NAME}/${report.id}`;
    try {
      const reportToSave = { ...report, userId };
      await setDoc(doc(db, COLLECTION_NAME, report.id), reportToSave);
      // Also save locally as cache
      storage.saveLocal(reportToSave);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  getReports: async (userId: string): Promise<Report[]> => {
    const path = COLLECTION_NAME;
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const reports: Report[] = [];
      querySnapshot.forEach((doc) => {
        reports.push(doc.data() as Report);
      });
      return reports;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  deleteReport: async (id: string) => {
    console.log(`[Storage] Deleting report with ID: ${id}`);
    const path = `${COLLECTION_NAME}/${id}`;
    
    // Try to delete from Firestore
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      console.log(`[Storage] Successfully deleted from Firestore: ${id}`);
    } catch (error) {
      console.error(`[Storage] Firestore delete failed for ${id}:`, error);
      handleFirestoreError(error, OperationType.DELETE, path);
    }
    
    // ALWAYS update local cache
    try {
      const reports = storage.getLocalReports().filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      console.log(`[Storage] Updated local cache, remaining: ${reports.length}`);
    } catch (localError) {
      console.error(`[Storage] Error updating local cache for ${id}:`, localError);
    }
  },

  testConnection: async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }
};
