const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const textarea = $("#code-input")
const iframe = $("#preview-frame")

const defaultCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`

if (!textarea.value) {
    textarea.value = defaultCode
}

function updatePreview() {
    const code = textarea.value
    iframe.srcdoc = code
}

textarea.addEventListener("input", updatePreview)

// window.onbeforeunload = function (e) {
//     e.preventDefault()
//     e.returnValue = ""
// }
const customMenu = $("#custom-context-menu")
const clearCodeBtn = $("#clear-code")
const copyCodeBtn = $("#copy-code")

document.addEventListener("contextmenu", function (e) {
    e.preventDefault()
    customMenu.style.display = "block"

    if (e.clientX + 100 > window.innerWidth) {
        customMenu.style.left = e.clientX - 150 + "px"
        customMenu.style.top = e.clientY - 50 + "px"
    } else if (e.clientY + 100 > window.innerHeight) {
        customMenu.style.left = e.clientX - 50 + "px"
        customMenu.style.top = e.clientY - 65 + "px"
    } else {
        customMenu.style.left = e.clientX + "px"
        customMenu.style.top = e.clientY + "px"
    }
})

document.addEventListener("click", function (e) {
    if (customMenu.style.display === "block") {
        customMenu.style.display = "none"
    }
})
clearCodeBtn.onclick = function () {
    textarea.value = defaultCode
    updatePreview()
}
copyCodeBtn.onclick = function () {
    textarea.select()
}
document.addEventListener(
    "scroll",
    function () {
        if (customMenu.style.display === "block") {
            customMenu.style.display = "none"
        }
    },
    true
)

updatePreview()
