import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { BlogService } from '../../services/blog.service';

import { KeyValuePipe } from '@angular/common';
import { BlogInfo, BlogLinks, } from '../../models/blog-info';
import { RouterLink } from '@angular/router';
import { SeriesList } from '../../models/post';
import { FollowDialogComponent } from '../../partials/follow-dialog/follow-dialog.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [KeyValuePipe, RouterLink, FollowDialogComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  blogInfo!: BlogInfo;
  blogName: string = '';
  // start with default image to prevent 404 when returning from post-details page
  blogImage: string = '/assets/images/angular-headless-hashnode-logo.jpg';
  siteFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  blogSocialLinks!: BlogLinks;
  seriesList!: SeriesList[];
  themeService: ThemeService = inject(ThemeService);
  blogService: BlogService = inject(BlogService);
  modalService: ModalService = inject(ModalService);
  private querySubscription?: Subscription;

  ngOnInit(): void {
    this.querySubscription = this.blogService
      .getBlogInfo()
      .subscribe((data) => {
        this.blogInfo = data;
        this.blogName = this.blogInfo.title;
        if (this.blogInfo.isTeam && this.blogInfo.favicon) {
          this.blogImage = this.blogInfo.favicon;
          this.siteFavicon.href = this.blogInfo.favicon;
        } else {
          this.blogImage = '/assets/images/angular-headless-hashnode-logo.jpg'
          this.siteFavicon.href = 'favicon.ico';
        }

        if (!this.blogInfo.isTeam) {
          this.blogService
          .getAuthorInfo()
          .subscribe((data) => {
            this.blogImage = data.profilePicture;
            if (data.profilePicture) {
              this.siteFavicon.href = data.profilePicture;
            } else {
              this.blogImage = '/assets/images/angular-headless-hashnode-logo.jpg'
              this.siteFavicon.href = 'favicon.ico';
            }
          });
        }
        const { __typename, ...links } = data.links;
        this.blogSocialLinks = links;
      });
    this.querySubscription = this.blogService
      .getSeriesList()
      .subscribe((data) => {
        this.seriesList = data;
      });
  }

  toggleTheme(): void {
    this.themeService.updateTheme();
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
  }
}
