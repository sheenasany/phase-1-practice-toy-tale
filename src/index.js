let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', addNewToy);
      
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
  
  
  fetch("http://localhost:3000/toys/")
.then(res => res.json())
// data returned from the server is iterated over and each toy is sent as a call back function
.then(toys => 
  toys.forEach(toy => toyCard(toy))
  
  )

  // create a global variable of the toy container, this sits above the <div class="card">
  const toyContainer = document.querySelector('#toy-collection')
  //console.log(toyContainer)
  
  // function that handles callback for each item in array and creates a card for it
function toyCard(addInfo) {
  // create element of div for each card from example <div class="card">
  const card = document.createElement('div')
  // set the attribute of class with the name of card on div 
  card.setAttribute('class', 'card') // needs to be name of card because the css page is looking specifically to create the cards under the class name of card
  // then console.log(card)
  // append the new element (card) to the toy container onto the page 
  //so that all cards can appear  
  toyContainer.append(card)
  
  // create new element h2 and append to card, otherwise these elements are just floating 
  const toyName = document.createElement('h2')
  // attach name of the toy in newly created element using the key of name (check json)
  toyName.innerText = addInfo.name
  
  // create new element of image 
  const image = document.createElement('img')
  // add attributes of class with the name of "toy-avatar" to the new element
  image.setAttribute('class', 'toy-avatar')
  // attach the data's src to the element of img using the key of image (check json) 
  image.src = addInfo.image
  
  // create a new element of p
  const likes = document.createElement('p')
  // attach data's info of likes to p element using inner text and string interpolation
  likes.innerText = `${addInfo.likes} likes`

  // create Like Button and add class attribute to it
  const likeButton = document.createElement('button')
  //console.log(likeButton)
  // set class attribute with a name of "like-btn" to the new element
  likeButton.setAttribute("class", "like-btn")
  likeButton.setAttribute("id", `${addInfo.id}`)
  likeButton.innerText = "Like 💗"
  
  // append the packaged elements to the card
  card.append(toyName, image, likes, likeButton)
  
  
  // add event listener to like button to increase number of likes using callback function
  likeButton.addEventListener('click', likePatch)
}

const likePatch = (e) => {
  //remember, still need e.preventDefault as we are sending something
  // to json so we need to keep the fetch request from previous function from 
  // running the patch. Only want the patch to happen on the click only
  e.preventDefault()
  // since we can't pass down the data from previous function
  // we need to use the element and their contents instead
  // console.log(e.target) = gives you the button element with its class and id
  // the id holds what we want for our patch request url
  // but we also want the previous element within the card div which is our p tag holding our likes
  // once we get the inner text, it's still a string, so parseInt it
  let likesNum = parseInt(e.target.previousElementSibling.innerText)
  // console.log("before patch: ", addInfo.likes)
  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    // every time our patch happens we need to add 1
    // create a key value pair, specific to our likes, and similar to original db json format
    body: JSON.stringify({likes: likesNum += 1})
  })
  // remember to return a response json object
  .then(res => res.json())
  // change our p tags inner text to that of our newly updated/patched obj and string interpolate it
  .then(newObj => e.target.previousElementSibling.innerText = `${newObj.likes} likes`)
}

// call back function from event listener for addBtn (POST request)
const addNewToy = (e) => {
  e.preventDefault();
  // console.log(e.target.likes)
  
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    // use (e.target.name) this pulls the element name from the form
    // tacking on the value takes the input from the form and then plug it
    // in to the body of the post request 
    // same for images and then add zero for the likes of each new toy
    body: JSON.stringify({
      name: e.target.name.value,
      image: e.target.image.value,
      likes: "0 "
    })
  })
  
  .then(res => res.json())
  .then(newToyObj => toyCard(newToyObj))
}


