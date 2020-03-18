import moment from "moment";

export default class GithubClone {
  constructor(destination) {
    this.destination = destination;
    this.destinationSelect = document.querySelector(this.destination);
    this.headerContent = `
        <section class="logo-container">
         <div class="logo-out"><div class="logo-in"><div class="logo"></div></div></div>
          <h1>GitHub clone</h1>
        </section>
        
        <section class="user"><div class="img-container">
         <section>
         <button class="new-repo">New Repository</button>
         </section>
         <h4>Signed in as <span class="user-name"></span></h4>
          <img src="" alt="" class="avatar" /></div>
        </section>
        `;

    this.form = `
        <div class="block"> 
          <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
        </div>
        <button id="btn-x">×</button>
        <h1>Create New Repository</h1>
        <div class="input-container">
          <label for="repo-name">Repository Name</label>
          <input type="text" id="repo-name" />
          <label for="description">Description(optional)</label>
          <input type="text" id="description" />
        </div>
        <div class="check">
          <label for="public" class="radio-container">
          <input type="radio" name="definition" id="public" value="public" checked />
           <span class="checkmark"></span>
          Public
          </label>
          <div>Anyone can see this repository. You choose who can commit.</div>
          <label for="private" class="radio-container">
          <input type="radio" name="definition" id="private" value="private" />
          <span class="checkmark"></span>
          Private
          </label>
          <div>You choose who can see and commit to this repository.</div>
        </div>
        <div class="check">
          <label for="initialize-readme" class="check-container">
          <input type="checkbox" name="" id="initialize-readme" />
           <span class="checkmark"></span>
          Initialize this repository with a README
          </label>
          <div>This will let you immediately clone the repository to your computer.</div>
        </div>
        <div class="buttons">
         <div class="button-container"><button class="btn" id="cancel">Cancel</button></div><div class="button-container"><button class="btn" id="create-repo">Create Repository</button></div>
         </div>
     
      `;

    this.apiKey = process.env.API_KEY;
    this.baseURL = `https://api.github.com`;
    this.header = document.createElement("header");

    this.sideBar = document.createElement("section");
    this.sideBar.classList.add("side-bar");
    this.header.innerHTML = this.headerContent;
    this.formContainer = document.createElement("form");
    this.formContainer.innerHTML = this.form;
    this.listContainer = document.createElement("ul");
    this.destinationSelect.appendChild(this.header);
    this.sideBar.appendChild(this.formContainer);
    this.destinationSelect.appendChild(this.sideBar);
    this.addEventToForm();
    this.getUserInfo();
    this.getUserRepos();
    this.addEventToNewRepoButtons();
  }

  async getUserInfo() {
    try {
      let response = await fetch(`${this.baseURL}/user`, {
        method: "GET",
        headers: {
          Authorization: `token ${this.apiKey}`
        }
      });
      let data = await response.json();
      document.querySelector(".user-name").innerText = data.login;
      document.querySelector(".avatar").setAttribute("src", data.avatar_url);
    } catch (error) {
      console.log(error);
    }
  }

  async getUserRepos() {
    try {
      let response = await fetch(`${this.baseURL}/user/repos?sort=created&direction=desc`, {
        method: "GET",
        headers: {
          Authorization: `token ${this.apiKey}`
        }
      });
      let data = await response.json();

      if (!response.ok) {
        this.spinner.style.display = "block";
        this.listContainer.style.display = "none";
      } else {
        let listRepos = data
          .map(userObj => {
            this.name = userObj.name;
            this.description = userObj.description;
            this.createdAt = userObj.created_at;
            this.url = userObj.html_url;

            return `<a href=${this.url} target="_blank"><li>
              <div class="top">
              <div class="title">
                <h3>${this.name}</h3>
              </div>
              <div class="date">
                <p>${moment(this.createdAt).fromNow()}</p>
              </div>
              </div>
              <div class="description">
                <p> ${this.description}</p>
              </div>
            </li></a>`;
          })
          .join("\n");

        this.listContainer.innerHTML = listRepos;
        this.destinationSelect.appendChild(this.listContainer);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createNewRepo() {
    try {
      const formData = {
        name: document.querySelector("#repo-name").value,
        description: document.querySelector("#description").value,
        private: document.querySelector("form").elements.definition.value,
        auto_init: document.querySelector("#initialize-readme").checked
      };

      let response = await fetch(`${this.baseURL}/user/repos`, {
        method: "POST",
        headers: {
          Authorization: `token ${this.apiKey}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        let data = await response.json();
        this.getUserRepos();
        console.log("success", data);
        document.querySelector(".block").style.display = "none";
      } else {
        setTimeout(() => {
          document.querySelector(".block").style.display = "none";
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  addEventToForm() {
    document.querySelector("#create-repo").addEventListener("click", event => {
      event.preventDefault();
      document.querySelector(".block").style.display = "flex";
      this.createNewRepo();
    });
  }

  addEventToNewRepoButtons() {
    document.querySelector(".new-repo").addEventListener("click", event => {
      event.preventDefault();
      document.querySelector(".side-bar").classList.add("slide-in");
    });

    document.querySelector("#btn-x").addEventListener("click", event => {
      event.preventDefault();
      document.querySelector(".side-bar").classList.remove("slide-in");
    });

    document.querySelector("#cancel").addEventListener("click", event => {
      event.preventDefault();
      document.querySelector(".side-bar").classList.remove("slide-in");
    });
  }
}
