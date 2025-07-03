const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const users = [
    { id: 1, name: "Dư Sương", age: 23, image: "./images/Candice.jpg" },
    { id: 2, name: "Rita", age: 25, image: "./images/Rita.jpg" },
    { id: 3, name: "Tiểu Ngọc", age: 22, image: "./images/Hilda.jpg" },
    { id: 4, name: "Iris", age: 24, image: "./images/Iris.jpg" },
    { id: 5, name: "Hạ An", age: 26, image: "./images/Gugu.jpg" },
]

const list = $(".list")
let isTouching = false,
    touchStartX = 0

let swipeThreshold = 100,
    currentIndex = users.length - 1

let liked = []
let disliked = []

function getCurrentElement() {
    const user = users[currentIndex]
    if (!user) return null
    const element = list.querySelector(`[data-id="${user.id}"]`)
    return element
}

function renderUser() {
    list.innerHTML = ""
    users.forEach((user) => {
        const item = document.createElement("div")
        item.innerHTML = `
        <img src="${user.image}" />
        <div class="item-info">
            <h2 class="item-name">${user.name}</h2>
            <p class="item-age">${user.age} tuổi</p>
        </div>
        `
        item.dataset.id = user.id
        item.className = "item"
        list.appendChild(item)
    })
}

renderUser()

list.ontouchstart = function (e) {
    touchStartX = e.touches[0].clientX
    isTouching = true
    const userElement = getCurrentElement()
    if (userElement) {
        userElement.classList.add("dragging")
        userElement.style.transition = "none"
    }
}

list.ontouchmove = function (e) {
    if (isTouching) {
        const userElement = getCurrentElement()
        if (userElement && users.length) {
            const distanceX = e.touches[0].clientX - touchStartX
            const maxRotate = 18
            const rotate = Math.max(-maxRotate, Math.min(maxRotate, distanceX / 10))
            userElement.style.transform = `translate(${distanceX}px) rotate(${rotate}deg)`
            userElement.classList.remove("swiping-left", "swiping-right")
            if (distanceX < -20) {
                userElement.classList.add("swiping-left")
            } else if (distanceX > 20) {
                userElement.classList.add("swiping-right")
            }
        }
    }
}

list.ontouchend = function (e) {
    const userElement = getCurrentElement()
    if (!userElement) return
    const changeTouchX = e.changedTouches[0].clientX
    const distanceX = changeTouchX - touchStartX
    if (distanceX < -swipeThreshold) {
        userElement.classList.remove("swiping-left", "dragging")
        userElement.classList.add("swipe-left")
        showToast("Bỏ qua 🙂", "passed")
        setTimeout(() => {
            if (users.length) {
                disliked.push(users[users.length - 1])
            }
            users.pop()
            userElement.remove()
            currentIndex = users.length - 1
            if (!users.length) {
                const done = document.createElement("div")
                done.className = "done"
                done.innerHTML = `<p>Bạn đã duyệt hết danh sách gợi ý 👍</p>`
                list.appendChild(done)
            }
        }, 100)
    } else if (distanceX > swipeThreshold) {
        userElement.classList.remove("swiping-right", "dragging")
        userElement.classList.add("swipe-right")
        showToast("Đã thích 😍", "liked")
        setTimeout(() => {
            if (users.length) {
                liked.push(users[users.length - 1])
            }
            users.pop()
            userElement.remove()
            currentIndex = users.length - 1
            if (!users.length) {
                const done = document.createElement("div")
                done.className = "done"
                done.innerHTML = `<p>Bạn đã duyệt hết danh sách gợi ý 👍</p>`
                list.appendChild(done)
            }
        }, 100)
    } else {
        userElement.classList.remove(
            "swiping-left",
            "swiping-right",
            "dragging",
            "swipe-left",
            "swipe-right"
        )
        userElement.style.transition = "transform 0.15s"
        userElement.style.transform = "translate(0,0)"
    }
    isTouching = false
    touchStartX = 0
}

function showToast(message, status) {
    let toast = document.querySelector(".toast")
    if (toast) {
        toast.classList.remove("toast-out")
        toast.remove()
    }
    toast = document.createElement("div")
    toast.className = `toast ${status}`
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => {
        toast.classList.add("toast-out")
        setTimeout(() => toast.remove(), 300)
    }, 1500)
}
