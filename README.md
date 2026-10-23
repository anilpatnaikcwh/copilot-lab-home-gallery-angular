
# GitHub Copilot Workshop using Angular

## Enhance a Home Gallery app using GitHub Copilot

In this fun workshop, you will learn how to use GitHub Copilot to enhance an Angular app, with little to no Angular experience required.

The project contains a simple Angular application.

Participants will be guided to install the GitHub Copilot VS Code extension, and then use it to enhance the app. You will also use GitHub Copilot to write some missing unit tests for the app. Estimated time to complete: `10 to 60 minutes`.

## Instructions 

Inside the `labs` folder you will find a number of markdown files that contain the instructions for this workshop.

Filename | Description
--- | ---
[exercise-1.md](</labs/exercise-1.md>) | Running Angular App
[exercise-2.md](</labs/exercise-2.md>) | Add routes to the application
[exercise-3.md](</labs/exercise-3.md>) | Integrate details page into application
[exercise-4.md](</labs/exercise-4.md>) | Adding a form to your Angular app
[exercise-5.md](</labs/exercise-5.md>) | Add the search feature to your app
[exercise-6.md](</labs/exercise-6.md>) | Add HTTP communication to your app
[exercise-7.md](</labs/exercise-7.md>) | Building tests
[exercise-8.md](</labs/exercise-8.md>) | Create a Dockerfile
[exercise-9.md](</labs/exercise-9.md>) | Document the code

## Project Structure

In this project you will find:

* the Angular Home Gallery application
* a devcontainer that installs GitHub Copilot when the Codespace is created (If you want to use Codespaces)
* an `labs` folder all the instructions for this workshop.

## Deploy to GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds and deploys the app whenever changes are pushed to `main`. It also supports manual runs from the repository's **Actions** tab.

To enable deployment, open the repository's **Settings → Pages** and set the build and deployment source to **GitHub Actions**. After the workflow succeeds, the site is available at `https://anilpatnaikcwh.github.io/copilot-lab-home-gallery-angular/`.

The workflow builds with the repository subpath and publishes a `404.html` fallback so Angular routes continue working when a detail page is refreshed.

## FAQ 

- **How do I get a GitHub Copilot license?**
  - You can request a trial license from your GitHub Sales representative or via Copilot for Individuals or Business licenses.
- **How do I get a GitHub Codespaces license?**
    - Codespaces is included with GitHub Enterprise Cloud, GitHub Enterprise Server, and GitHub Free. You can check under your [billing settings page](https://github.com/settings/billing).
- **I am having trouble activating GitHub Copilot after I load the plugin, what should I do?**
    - This could be because you launched your Codespace before you activated GitHub Copilot or accepted the invitation to the trial org. Please try to reload your Codespace and try again.

## Acknowledgements

The Angular Home Gallery app and lab exercise is based on below tutorial: https://angular.dev/tutorials/first-app/01-hello-world

Enjoy your workshop!
