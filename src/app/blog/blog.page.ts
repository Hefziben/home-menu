import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  articles = [
    {
      title:'Working from Home and Your Health',
      image:'./assets/blog/Working from home and your health.jpg',    
      desc:"At the start of the COVID-19 pandemic, many of us were overjoyed with the idea of working from home."
    },
    {
      title:'Reconfiguring our cities',
      image:'./assets/blog/Reconfiguring our cities.jpg',
      desc:"Modern cities have traditionally been the big hubs of business and activity. Now, the looming"
      },
    {
      title:'Reimagining work',
      image:'./assets/blog/Reimagining work.jpg',
      desc:"How will work evolve in a post-pandemic world? COVID-19 has challenged many of our norms,"
    },
    {
      title:'Return to the neighborhood',
      image:'./assets/blog/Return to the neighborhood.jpg',
      desc:"The coronavirus arrived at the world’s doorstep like an uninvited guest. As it overstays its welcome,"
    },
    {
      title:'5 Completely serious reasons to go back to commuting to work',
      image:'./assets/blog/Killing the commute.jpg',
      desc:"Thanks to COVID-19, we are all — willingly or unwillingly — participants in the longest trial run "
    },
  ];
  selectedBlog = 0;
  article_number = 0;
  blogArray = [];
  menu = true;
  blogConfig = {"slidesToShow": 2, "slidesToScroll": 1, "infinite":false,
};
  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1, "infinite":false, "centerMode":true, "initialSlide":1};
article;
@ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(private modal:ModalController, private route:ActivatedRoute, private router:Router) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.article = this.router.getCurrentNavigation().extras.state.article;
        this.menu = false;
        console.log(this.article);
        this.readArticle(this.article);
        
                
      }
    });
   }

  ngOnInit() {
for (const item of this.articles) {
  this.blogArray.push(item);
}
      
  }
  readArticle(article) {
    console.log(article);
    if (article == "Working from Home and Your Health") {
      this.article_number = 0;
      console.log(this.article_number);
    }
    if (article == "Reconfiguring our cities") {
      this.article_number = 1;
      console.log(this.article_number);
    }
    if (article == "Reimagining work") {
      this.article_number = 2;
      console.log(this.article_number);
    }
    if (article == "Return to the neighborhood") {
      this.article_number = 3;
      console.log(this.article_number);
    }
    if (
      article == "5 Completely serious reasons to go back to commuting to work"
    ) {
      this.article_number = 4;
      console.log(this.article_number);
    }
      }
  
  filterArticles(article){  
    let i = this.article_number; 
    console.log(this.article_number);
    console.log(article);   
    console.log(i);
    this.backToTop();

    
    this.readArticle(article)
    console.log(this.articles);
    console.log(this.blogArray);
  }

  backToTop(){
    this.content.scrollToTop(1500)
  }
  ionViewWillEnter(){
    // for (let index = 0; index < 1; index++) {
      
    //   for (const blog of this.articles) {
    //     this.blogArray.push(blog);
      
    //   }
    //   console.log(this.blogArray);
      
      
    // }
  }
  blogInit(e) {
    console.log('blog initialized',e);
    this.selectedBlog = 0;
  }

  blogChange(e) {
    console.log('blog Change',e.currentSlide);
    this.selectedBlog = e.currentSlide
    console.log(this.selectedBlog, this.blogArray.length);
    if (this.selectedBlog == this.blogArray.length - 2) {
      for (const item of this.articles) {
        this.blogArray.push(item);
      }
    }
    
  }

  share(){

  }

  close() {
    this.modal.dismiss()
      }

      reserve(type) {
        let navigation: NavigationExtras = {
          state: {
            occupation:type
          },
        };
        this.router.navigate(["register"], navigation);
      }
   

}
