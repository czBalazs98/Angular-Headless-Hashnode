import { Component, inject, Input, OnInit } from '@angular/core';
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { Post } from "../../models/post";
import { BlogService } from "../../services/blog.service";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-post-search',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './post-search.component.html',
  styleUrl: './post-search.component.scss'
})
export class PostSearchComponent implements OnInit {
  @Input({required: true})
  blogId!: string;

  queryFormControl = new FormControl('');

  visible = false;

  blogService = inject(BlogService);

  router = inject(Router);

  posts: Post[] = [];

  ngOnInit() {
    this.queryFormControl.valueChanges.subscribe(query => this.searchPosts(query));
  }

  showDialog() {
    this.visible = true;
  }

  searchPosts(query: string | null) {
    this.blogService.searchPosts(this.blogId, query)
      .subscribe(response => {
        this.posts = response;
        console.log(this.posts);
      });
  }

  navigateToPost(slug: string) {
    this.visible = false;
    this.router.navigate(['/post', slug]);
  }

  clearQuery() {
    this.queryFormControl.reset();
  }
}
