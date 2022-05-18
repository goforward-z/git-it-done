//user-form variables
var userFormEl = document.querySelector("#user-form");
var nameIuputEl = document.querySelector("#username");

//showing list of repos variables
var repoContainerEl = document.querySelector("#repo-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//when search-from submit
var formSubmitHandler = function(event){
    event.preventDefault();
    //get value from input element
    var username = nameIuputEl.value.trim();

    if (username){
        //sent input vlaue to 
        getUserRepos(username);
        nameIuputEl.value ="";
    }else{
        alert("Please enter a GitHub username");
    }
    console.log(event);
};

userFormEl.addEventListener("submit",formSubmitHandler);

var getUserRepos =function(user){
    var apiUrl = "https://api.github.com/users/" + user +"/repos";

    fetch(apiUrl)
    .then(function(response){
        //request was successful
        if(response.ok){
          response.json().then(function(data){
            //sent search data to 
            displayRepos(data,user);
            console.log(data);

          });
        }else{
            alert("Error: GitHub User Not Found");
        }  
    })

    .catch(function(error){
        //notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to GitHub");
    });

};

//display repos

var displayRepos = function(repos, searchTerm){
    //check if api returned any repos
    if(repos.length === 0){
        repoContainerEl.textContent ="No Repositories found.";
        return;
    }
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    //loop over repos
    for(var i = 0; i < repos.length; i++){
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if(repos[i].open_issues_count > 0){
            statusEl.innerHTML ="<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";

        }else{
            statusEl.innerHTML = "<i class = 'fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);

    }
    console.log(repos);
    console.log(searchTerm);
};