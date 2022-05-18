
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");


//show reponame and open issues on second page 当点击搜索的结果在第一页的时候
var getRepoName = function(){
    //get the reponame
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    console.log(repoName);
    //if reponame exists
    if(repoName){
      //pass the 参数 to getrepoissues
       getRepoIssues(repoName);
       repoNameEl.textContent = repoName;
     }else{
         //if no repo was given,redirect to the home page
         document.location.replace("./index.html");
     }

};


var getRepoIssues = function(repo){
    var apiUrl = "https://api.github.com/repos/" + repo +"/issues?direction=asc";
    console.log(repo);

    fetch(apiUrl).then(function(response){
        //request was successful
        if(response.ok){
            response.json().then(function(data){
                //pass response data to dom function
                displayIssues(data);

                //check if api has paginated issues
                if(response.headers.get("link")){
                    displayWaring(repo);
                }
            });
        }
        else{
            //if not successful,redirect to homepage
            document.location.replace("./index.html");
        }
    });

};

var displayIssues = function(issues){
    if(issues.length === 0){
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    //create a loop 
    for(var i = 0; i < issues.length; i++){
        //create a link element to take users to the issue on github
        var issueEl = document.createElement('a');
        issueEl.classList ="list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);//links to the full issue on GitHub
        issueEl.setAttribute("target","_blank");//open a new page

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to contianer
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if(issues[i].pull_request){
            typeEl.textContent = "(Pull request)";
        }else{
            typeEl.textContent ="(Issues)";
        }

        //append to container
        issueEl.appendChild(typeEl);

        //append to issue-container
        issueContainerEl.appendChild(issueEl);

    }

};

//if repo has more than 30 issues
var displayWaring = function(repo){
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See more Issues on GitHub.com";
    linkEl.setAttribute("href","https://github.com/" + repo +"/issues");
    linkEl.setAttribute("target","_blank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
}



getRepoName();

