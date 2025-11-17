# Module Federation Microfrontend POC

This project demonstrates how to implement a typesafe **Module Federation**-based microfrontend architecture, without remote app side type definitions.
Check out my article on Medium regarding simple type-safe Vite+React Module Federation [here](https://adamkui.medium.com/stop-writing-remote-types-type-safe-module-federation-in-vite-react-e8f01788d820).

## Running the Project

1. `cd app-remote`
2. `npm install`
3. `npm run build`
4. `npm run preview`
5. Open a new terminal
6. `cd app-host`
7. `npm install`
8. `npm run dev`

The host application automatically loads the remote modules with Module Federation

## Project Structure

/app-host:  Main application

/app-remote:  Contains individual chart components and lodash library + type definitions generated at build

## Features

- Modular components loaded at runtime
- External library loaded at runtime
