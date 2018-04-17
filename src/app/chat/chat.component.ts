import { Component, OnInit } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	jQuery('.owl-carousel').owlCarousel({
    margin:48,
    loop:true,
    dots: false,
    autoWidth:true,
    items:4,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        600:{
            items:3,
            nav:false
        },
        1000:{
            items:10,
            loop:true
        }
    }
})
  }

}
