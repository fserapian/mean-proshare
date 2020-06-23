import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private subscription: Subscription;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    // this.posts = this.postService.getPosts();
    // this.subscription = this.postService.updatePostsListener()
    //   .subscribe(posts => this.posts = posts);

    this.postService.getPosts();
    this.subscription = this.postService.getPostsUpdatedListener()
      .subscribe(posts => {
        this.posts = posts;
      });
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
