import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';

enum Mode {
  CREATE,
  UPDATE
};

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  post: Post;
  postId: string;
  mode: Mode = Mode.CREATE;
  form: FormGroup
  imagePreview: string;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  onImagePicked(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    const title = this.form.value.title;
    const content = this.form.value.content;

    if (this.mode === Mode.CREATE) {
      this.postService.addPost(title, content);
      this.router.navigate(['/']);
    } else { // update post
      this.postService.updatePost(this.postId, title, content);
      this.router.navigate(['/']);
    }

    this.form.reset();

  }

  ngOnInit() {

    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('postId')) {
        this.mode = Mode.UPDATE;
        this.postId = params.get('postId');
        this.postService.getPost(this.postId)
          .subscribe((post) => {
            this.post = { id: post._id, title: post.title, content: post.content };
            this.form.setValue({ 'title': this.post.title, 'content': this.post.content });
          });
      } else {
        this.mode = Mode.CREATE;
        this.postId = null;
      }
    });
  }

}
