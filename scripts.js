const baseURL = 'https://api.edamam.com/api/recipes/v2';
const applicationId = '3729c505';
const applicationKeys = '978fab8b3883378b2176ca9fd4827af0';
const recipesPerPage = 6; // Number of recipes per page to display

let fetchedData = null; // Variable to store fetched data

async function searchRecipes() {
    const searchInput = document.getElementById('searchInput').value;
    const response = await fetch(`${baseURL}?type=public&q=${searchInput}&app_id=${applicationId}&app_key=${applicationKeys}`);
    fetchedData = await response.json();
    if (fetchedData.hits.length === 0) {
        displayNoRecipes();
    } else {
        displayRecipes(fetchedData.hits, 1, recipesPerPage); // Pass recipesPerPage
    }
}

function displayNoRecipes() {
    const recipeContainer = document.getElementById('recipeContainer');
    recipeContainer.innerHTML = '<h2 class="no-recipes-message">Sorry, we did not find any recipe !!!</h2>';
}


function displayRecipes(recipes, page, perPage) {
    const recipeContainer = document.getElementById('recipeContainer');
    recipeContainer.innerHTML = '';

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedRecipes = recipes.slice(startIndex, endIndex);

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('recipe-grid');

    paginatedRecipes.forEach(recipe => {
        const { label, image, url } = recipe.recipe;
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe-item');

        const recipeImage = document.createElement('img');
        recipeImage.src = image;

        const recipeTitle = document.createElement('h2');
        recipeTitle.textContent = label;

        const recipeLink = document.createElement('button');
        recipeLink.classList.add('recipe-button'); // Add a class for styling
        recipeLink.textContent = 'View Recipe';
        recipeLink.addEventListener('click', () => {
            window.open(url); // Open link in a new tab
        });

        recipeElement.appendChild(recipeImage);
        recipeElement.appendChild(recipeTitle);
        recipeElement.appendChild(recipeLink);

        gridContainer.appendChild(recipeElement);
    });

    recipeContainer.appendChild(gridContainer);

    if (recipes.length > perPage) {
        addPaginationButtons(recipes.length, page, perPage);
    }
}

function addPaginationButtons(totalRecipes, currentPage, perPage) {
    const totalPages = Math.ceil(totalRecipes / perPage); // Adjust calculation based on perPage
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination');

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', (event) => {
            displayRecipes(fetchedData.hits, parseInt(event.target.textContent), perPage);
        });
        paginationContainer.appendChild(button);
    }

    const recipeContainer = document.getElementById('recipeContainer');
    recipeContainer.appendChild(paginationContainer);
}
