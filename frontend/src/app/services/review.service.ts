import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaces matching your backend DTOs
export interface CreateReviewDto {
  userId: string;
  vehicleId: string;
  bookingId?: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface RespondToReviewDto {
  reviewId: string;
  response: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  // Add other user properties as needed
}

export interface Vehicle {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  // Add other vehicle properties as needed
}

export interface Review {
  id: string;
  userId: string;
  vehicleId: string;
  bookingId?: string;
  rating: number;
  title?: string;
  comment?: string;
  adminResponse?: string;
  createdAt: string;
  respondedAt?: string;
  user?: User;
  vehicle?: Vehicle;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly baseUrl = 'http://localhost:3000/api/reviews'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  /**
   * Create a new review
   */
  createReview(reviewData: CreateReviewDto): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, reviewData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all reviews
   */
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get reviews by user ID
   */
  getReviewsByUser(userId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get reviews by vehicle ID
   */
  getReviewsByVehicle(vehicleId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/vehicle/${vehicleId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Respond to a review (admin function)
   */
  respondToReview(responseData: RespondToReviewDto): Observable<Review> {
    return this.http.patch<Review>(`${this.baseUrl}/respond`, responseData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a review
   */
  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${reviewId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get average rating for a vehicle
   */
  getVehicleAverageRating(vehicleId: string): Observable<{average: number, count: number}> {
    return this.http.get<{average: number, count: number}>(`${this.baseUrl}/vehicle/${vehicleId}/average`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('ReviewService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}