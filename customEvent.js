const slideShowChange = new CustomEvent("slideshow:change", {
    detail: { old: "Hello from custom event!", current: "New " },
})
slidesContainer.dispatchEvent(slideShowChange);
 setTimeout(() => {
    document.dispatchEvent(new Event('slideshow:change'));
  }, 2000);