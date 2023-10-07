let sliderLeftBtn = document.querySelector('#slider-left');     
let left = 0;
			
let slider = document.querySelector('.progress__wrapper');
let startX;
let endX;

	sliderLeftBtn.addEventListener('click', function() {            
		left = left - 400;
		  if (left < -1700) {
			left = 0;
		  }
			slider.style.left = left + 'px';            
	   });
	
	slider.addEventListener('touchstart', e => {
		console.log('touchstart', e.touches[0].clientX);
		startX = e.touches[0].clientX;
	})
	slider.addEventListener('touchmove', e => {
		console.log('touchmovet', e.touches[0].clientX);
		endX = e.touches[0].clientX;
	});
		
	slider.addEventListener('touchend', e => {
		if (startX > endX) {
			left = left - 350;
			if (left < -1400) {
				left = 0;
			}
			slider.style.left = left + 'px';   
		} else {
			left = left + 350;
			if (left > 0) {
				left = 0;
			} 
			slider.style.left = left + 'px';
		}				
	})
	
	//------modal-----------

	const modalSocials = document.querySelectorAll("[data-modalsocial]"), 
    modalSocial = document.querySelector(".modalsocial"), 
    modalSocialCloseBtn = document.querySelector("[data-closesocial]"),
    socialIcons = document.querySelector('.modal__social-items');

    modalSocials.forEach((btn => {
        btn.addEventListener("click", (() => {
            modalSocial.classList.add("show");
            modalSocial.classList.remove("hide");
            document.body.style.overflow = "hidden";
        }));
    }));
    function closeModeSocial() {
        modalSocial.classList.add("hide");
        modalSocial.classList.remove("show");
        document.body.style.overflow = "";
    }
    modalSocialCloseBtn.addEventListener("click", closeModeSocial);
    socialIcons.addEventListener("click", closeModeSocial);
    modalSocial.addEventListener("click", (e => {
        if (e.target === modalSocial) closeModeSocial();
    }));
    document.addEventListener("keydown", (e => {
        if (e.code === "Escape" && modalSocial.classList.contains("show")) closeModeSocial();
    }));
			
    /*-----------copy-------------------*/
           
    const copyBtnModal = document.querySelector('.modalsocial__link'); 

    copyBtnModal.addEventListener('click', function copyTextModal () {         
        navigator.clipboard.writeText('https://volunteering.in.ua');
    });
        



 


    

	