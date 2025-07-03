import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateReviewDto, RespondToReviewDto, Review, ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() vehicleId?: string;
  @Input() userId?: string;
  @Input() isAdmin: boolean = false;
  @Input() showCreateForm: boolean = true;
  @Output() reviewCreated = new EventEmitter<Review>();
  @Output() reviewDeleted = new EventEmitter<string>();

  reviews: Review[] = [];
  loading = false;
  error: string | null = null;
  
  // Forms
  reviewForm: FormGroup;
  responseForm: FormGroup;
  
  // UI state
  showResponseForm: { [key: string]: boolean } = {};
  submittingResponse: { [key: string]: boolean } = {};
  
  // Star rating
  stars = [1, 2, 3, 4, 5];
  hoveredRating = 0;

  constructor(
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      title: [''],
      comment: ['', Validators.required],
      bookingId: ['']
    });

    this.responseForm = this.fb.group({
      response: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  /**
   * Load reviews based on input parameters
   */
  loadReviews(): void {
    this.loading = true;
    this.error = null;

    let reviewObservable;

    if (this.vehicleId) {
      reviewObservable = this.reviewService.getReviewsByVehicle(this.vehicleId);
    } else if (this.userId) {
      reviewObservable = this.reviewService.getReviewsByUser(this.userId);
    } else {
      reviewObservable = this.reviewService.getAllReviews();
    }

    reviewObservable.subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: (error: { message: string | null; }) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  /**
   * Create a new review
   */
  onSubmitReview(): void {
    if (this.reviewForm.valid && this.userId && this.vehicleId) {
      const formValue = this.reviewForm.value;
      const reviewData: CreateReviewDto = {
        userId: this.userId,
        vehicleId: this.vehicleId,
        rating: formValue.rating,
        title: formValue.title || undefined,
        comment: formValue.comment,
        bookingId: formValue.bookingId || undefined
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: (review: any) => {
          this.reviews.unshift(review); // Add to beginning of array
          this.reviewForm.reset({ rating: 5 }); // Reset form with default rating
          this.reviewCreated.emit(review);
        },
        error: (error: any) => {
          this.error = error.message;
        }
      });
    }
  }

  /**
   * Toggle response form visibility
   */
  toggleResponseForm(reviewId: string): void {
    this.showResponseForm[reviewId] = !this.showResponseForm[reviewId];
  }

  /**
   * Submit admin response to review
   */
  onSubmitResponse(reviewId: string): void {
    if (this.responseForm.valid) {
      this.submittingResponse[reviewId] = true;
      
      const responseData: RespondToReviewDto = {
        reviewId: reviewId,
        response: this.responseForm.value.response
      };

      this.reviewService.respondToReview(responseData).subscribe({
        next: (updatedReview: Review) => {
          // Update the review in the array
          const index = this.reviews.findIndex(r => r.id === reviewId);
          if (index !== -1) {
            this.reviews[index] = updatedReview;
          }
          
          this.responseForm.reset();
          this.showResponseForm[reviewId] = false;
          this.submittingResponse[reviewId] = false;
        },
        error: (error: { message: string | null; }) => {
          this.error = error.message;
          this.submittingResponse[reviewId] = false;
        }
      });
    }
  }

  /**
   * Delete a review
   */
  onDeleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r.id !== reviewId);
          this.reviewDeleted.emit(reviewId);
        },
        error: (error: { message: string | null; }) => {
          this.error = error.message;
        }
      });
    }
  }

  /**
   * Set rating from star click
   */
  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  /**
   * Set hovered rating for star display
   */
  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  /**
   * Reset hovered rating
   */
  resetHoveredRating(): void {
    this.hoveredRating = 0;
  }

  /**
   * Check if star should be filled
   */
  isStarFilled(star: number, rating: number): boolean {
    const displayRating = this.hoveredRating || rating;
    return star <= displayRating;
  }

  /**
   * Get star array for displaying ratings
   */
  getStarArray(rating: number): boolean[] {
    return this.stars.map(star => star <= rating);
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get rating text
   */
  getRatingText(rating: number): string {
    const ratingTexts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratingTexts[rating as keyof typeof ratingTexts] || 'Unknown';
  }
}