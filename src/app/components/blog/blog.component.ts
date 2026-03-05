import { Component } from '@angular/core';
import { NutritionDataService } from '../../shared/services/nutrition-data.service';
import { ToastService } from '../../shared/services/toast.service';
import { BlogPost } from '../../shared/models/nutrition.models';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  posts: BlogPost[];

  constructor(private data: NutritionDataService, public toastService: ToastService) {
    this.posts = this.data.blogPosts;
  }

  openPost(post: BlogPost): void {
    this.toastService.show(`📖 Opening: "${post.title}"`);
  }
}