const buttons = document.querySelectorAll('.but'); 
//list of all the buttons on the page, but not actual button elements the buttons I made to change websites
buttons.forEach( (button) => {
    button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#555a86ff";
    })
    button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = "#384E77";
    })
})
//goes through the list of buttons and gives them 2 events, one makes it darker when its being hovered over, the over changes it back
