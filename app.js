const user_img = document.querySelector(".user_img");
const userName = document.querySelector(".user_name h1");
const followers_ = document.querySelector(".item.followers span");
const follow_ = document.querySelector(".item.follow_ span");
const repo_details = document.querySelector(".repo_details");
const btn_submit = document.querySelector(".btn_submit");

let user_name = "";

function inputFunction() {
  let input_user = document.querySelector(".input_user").value.trim();

  if (input_user.length <= 0) {
    alert("Please Enter GitHub User Name");
    document.querySelector(".input_user").value = "";
    document.querySelector(".input_user").focus();
    return false;
  } else {
    user_name = input_user;
    fetchUser();
    document.querySelector(".input_user").value = "";
    document.querySelector(".input_user").focus();
  }
}

btn_submit.addEventListener("click", function () {
  inputFunction();
});

document.querySelector(".input_user").addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    inputFunction();
  }
});

function fetchUser() {
  fetch(`https://api.github.com/users/${user_name}`)
    .then((response) => response.json())
    .then(function (data) {
      if (data.message === "Not Found") {
        user_img.innerHTML = `<img src="github_logo.png" alt="No user">`;
        userName.innerHTML = "No user";
        followers_.innerHTML = "0";
        follow_.innerHTML = "0";

        repo_details.innerHTML = `
                <div class="item_">
                    <div class="repo_name">No user found</div>
                </div>
            `;

        return false;
      } else {
        user_img.innerHTML = `<img src="${data.avatar_url}">`;
        userName.innerHTML = data.login;
        followers_.innerHTML = data.followers;
        follow_.innerHTML = data.following;
      }
    });

  fetch(`https://api.github.com/users/${user_name}/repos`)
    .then((response) => response.json())
    .then(function (repo_data) {
      if (repo_data.message === "Not Found" || repo_data.length === 0) {
        repo_details.innerHTML = `
                <div class="item_">
                    <div class="repo_name">No repo Found</div>
                </div>
            `;
      } else {
        let reposHTML = repo_data
          .map((item) => {
            return `
                    <div class="item">
                    <a href="${item.html_url}" target="_blank">
                        <div class="repo_name">
                            ${item.name}
                        </div>
                        <div class="repo_details_">
                            <div class="info_ star"><i class="fa fa-star-o"></i>${item.stargazers_count}</div>
                            <div class="info_ fork">
                                <p><i class="fa fa-code-fork"></i>${item.forks_count}</p>
                            </div>
                            <div class="info_ size">
                                <p><i class="fa fa-file"></i>${item.size}kb</p>
                            </div>
                            
                        </div>
                        </a>
                    </div>
                `;
          })
          .join("");
        repo_details.innerHTML = reposHTML;
      }
    });
}
