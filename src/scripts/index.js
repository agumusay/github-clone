import "../styles/main.scss";
import "regenerator-runtime/runtime";
import GithubClone from "./components/github-clone";

document.addEventListener("DOMContentLoaded", () => {
  new GithubClone("main");
});
