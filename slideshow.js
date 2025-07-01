const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const slides = $$(".slide")
const nextBtn = $(".next")
const prevBtn = $(".prev")
const slidesContainer = $(".slideshow-container")

let currentIndex = 0
let isAnimating = false
const duration = 500

function showSlide(newIndex, direction) {
    if (isAnimating || newIndex === currentIndex) return
    isAnimating = true

    const prevSlide = slides[currentIndex]
    const nextSlide = slides[newIndex]

    slides.forEach((slide) => {
        slide.classList.remove(
            "active",
            "slide-in-left",
            "slide-in-right",
            "slide-out-left",
            "slide-out-right"
        )
        slide.style.transitionDuration = ""
    })

    prevSlide.style.transitionDuration = nextSlide.style.transitionDuration =
        duration + "ms"

    if (direction === "next") {
        prevSlide.classList.add("slide-out-left")
        nextSlide.classList.add("slide-in-right")
    } else {
        prevSlide.classList.add("slide-out-right")
        nextSlide.classList.add("slide-in-left")
    }

    const onTransitionEnd = (event) => {
        if (event.target !== prevSlide) return
        prevSlide.removeEventListener("transitionend", onTransitionEnd)
        nextSlide.removeEventListener("transitionend", onTransitionEnd)
        slides.forEach((slide) => {
            slide.classList.remove(
                "active",
                "slide-in-left",
                "slide-in-right",
                "slide-out-left",
                "slide-out-right"
            )
            slide.style.transitionDuration = ""
        })
        nextSlide.classList.add("active")
        currentIndex = newIndex
        isAnimating = false
        updatePagination()
        const slideshowChange = new CustomEvent("slideshow:change", {
            detail: {
                old: prevSlide,
                current: nextSlide,
            },
        })
        document.dispatchEvent(slideshowChange)
    }
    prevSlide.addEventListener("transitionend", onTransitionEnd)
    nextSlide.addEventListener("transitionend", onTransitionEnd)
}

nextBtn.addEventListener("click", () => {
    if (isAnimating) return
    const newIndex = (currentIndex + 1) % slides.length
    showSlide(newIndex, "next")
})

prevBtn.addEventListener("click", () => {
    if (isAnimating) return
    const newIndex = (currentIndex - 1 + slides.length) % slides.length
    showSlide(newIndex, "back")
})

slides.forEach((slide, index) => {
    slide.classList.remove("active")
    if (index === currentIndex) slide.classList.add("active")
})

let autoPlay = setInterval(function () {
    const newIndex = (currentIndex + 1) % slides.length
    showSlide(newIndex, "next")
}, 3000)

slidesContainer.addEventListener("mouseover", (e) => {
    clearInterval(autoPlay)
})

slidesContainer.addEventListener("mouseout", (e) => {
    autoPlay = setInterval(function () {
        const newIndex = (currentIndex + 1) % slides.length
        showSlide(newIndex, "next")
    }, 3000)
})

// Pagination
let paginationContainer = $(".pagination")
if (!paginationContainer) {
    paginationContainer = document.createElement("div")
    paginationContainer.className = "pagination"
    slidesContainer?.appendChild(paginationContainer)
}
function renderPagination() {
    paginationContainer.innerHTML = ""
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement("span")
        dot.className = "dot"

        if (i === currentIndex) dot.classList.add("active")

        dot.addEventListener("click", () => {
            if (!isAnimating && i !== currentIndex) {
                showSlide(i, i > currentIndex ? "next" : "back")
            }
        })

        paginationContainer.appendChild(dot)
    }
}

function updatePagination() {
    const dots = paginationContainer.querySelectorAll(".dot")
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex)
    })
}

renderPagination()
