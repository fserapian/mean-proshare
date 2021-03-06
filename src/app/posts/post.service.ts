import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, subscribeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private url = 'http://localhost:3000/api/posts/';

  constructor(private http: HttpClient) { }

  getPosts(): void {
    this.http.get<{ message: string, posts: any }>(this.url)
      .pipe(
        map((res) => res.posts.map((post: { _id: string, title: string, content: string }) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          }
        }))
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string): Observable<{ _id: string, title: string, content: string }> {
    // return { ...this.posts.find(post => post.id === id) };
    return this.http.get<{ _id: string, title: string, content: string }>(this.url + id);
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string): void {
    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]);

    const post = { id: null, title, content };

    this.http.post<{ postId: string, message: string }>(this.url, post)
      .subscribe(res => {
        const postId = res.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {

    const post = { id, title, content };

    this.http.put<{ message: string }>(this.url + id, post)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const postIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[postIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete(this.url + postId)
      .subscribe((res: { message: string }) => {
        console.log(res);
        const posts = this.posts.filter(post => post.id !== postId);
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      })
  }

}
