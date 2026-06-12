


/* for header */
let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');
menu.onclick=()=>{
    menu.classList.toggle('fa-times');    
    navbar.classList.toggle('active');
}
window.onscroll=()=>{
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    if(window.scrollY > 0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
  
}
window.onload=()=>{
    if(window.scrollY > 0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
}
// for home screen section slider
var swiper = new Swiper(".home-slider", {
    spaceBetween: 20,
    effect: "fade",
    grabCursor:true,
    loop:true,
    centeredSlides:true,
    autoplay: {
        delay: 9500,
        disableOnInteraction: false
      },
  });

//   for feature sports
var swiper = new Swiper(".feature-slider", {
    spaceBetween: 20,
    grabcursor:true,
    loop:true,
    centeredSlides:true,
    autoplay: {
      delay:6500,
      disableOnInteraction:false,
    },
    breakpoints:{
        0:{
            slidesPerView:1,
        },
        758:{
            slidesPerView:2,
        },
        991:{
            slidesPerView:3,
        },
    },
  });
  //for coaches section
  var swiper = new Swiper(".trainer-slider", {
    spaceBetween: 20,
    grabcursor:true,
    loop:true,
    centeredSlides:true,
    autoplay: {
      delay:9500,
      disableOnInteraction:false,
    },
    breakpoints:{
        0:{
            slidesPerView:1,
        },
        758:{
            slidesPerView:2,
        },
        991:{
            slidesPerView:3,
        },
    },
  });
  //testimonial
  var slide= document.getElementById("slide");
  var uparrow=document.getElementById("up");
  var downarrow=document.getElementById("down");
  let x=0;
  
  uparrow.onclick= function(){
    if(x>"-900")
    {

        x=x-300;
        slide.style.top=x+"px";
    }
    
  }
  downarrow.onclick= function(){
    if(x<0)
    {

        x=x+300;
        slide.style.top=x+"px";
    }

    
    
  }
  
  

  
  
  //for acheivement 
  var swiper = new Swiper(".a-slider", {
    spaceBetween: 20,
    grabcursor:true,
    loop:true,
    centeredSlides:true,
    autoplay: {
      delay:8500,
      disableOnInteraction:false,
    },
    breakpoints:{
        0:{
            slidesPerView:1,
        },
        758:{
            slidesPerView:2,
        },
        991:{
            slidesPerView:3,
        },
    },
  });
  //for image gallery
  function filterGallery(category) {
    var galleryItems = document.getElementsByClassName('pic');

    // Show all items if the category is 'all'
    if (category === 'all') {
      for (var i = 0; i < galleryItems.length; i++) {
        galleryItems[i].style.display = 'block';
      }
      return;
    }

    // Hide items that don't belong to the selected category
    for (var i = 0; i < galleryItems.length; i++) {
      var item = galleryItems[i];
      var itemCategory = item.getAttribute('data-category');

      if (itemCategory === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    }
  }


  // new testimonial
  
  