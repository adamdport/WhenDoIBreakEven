import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute }     from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private titleService: Title, private router: Router, route: ActivatedRoute){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => route),
      map(route => {
        while (route.firstChild) route = route.firstChild; //gets the deepest child
        return route;
      }),
      filter(route => route.outlet === 'primary'))
      .subscribe((route) => {
         if(route.snapshot.data['title'] !== undefined){
           this.titleService.setTitle("When do I break even..." + route.snapshot.data['title']);
         }
    });
  }
}
