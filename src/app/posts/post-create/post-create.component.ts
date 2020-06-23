import { Component } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  constructor(private postService: PostService) { }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const title = form.value.title;
    const content = form.value.content;

    this.postService.addPost(title, content);
  }

}
