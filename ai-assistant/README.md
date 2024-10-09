# AiAssistant

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.13.

## Structure

Go to `projects` folder <br/>

It has a library named `ai-assistant` <br/>

 To build the library: `npm run build-library` <br/>

 Now,At the root level the build will be successful at `dist/ai-assistant` <br/>

 To pack the library for targz: `npm run pack-lib` <br/>

 Now,At the root level the targz will be successfully created at `dist/ai-assistant/ai-assistant-0.0.1.tgz` <br/>

It has a application named `demo-sandbox` <br/>
Purpose: It serves as demo application to utilize the `ai-assistant` library <br/>
`app.component.ts` and `app.component.html` contains respective integration code for `ai-assistant` library. <br/>

## Run the sandbox
from root of project reach to `demo-sandbox` and then `npm run start`. <br/> By default `http://localhost:4200` will be active

## How to use targz in completely new project/repo?

In your `package.json` do,

```
"dependencies": {
    ...exisitng dependencies,
    "ai-assistant": "file:ai-assistant-0.0.1.tgz"
    
  },
```
This includes pre-requisite that `tgz` is packed from `library` and exists in your project/repo

Make sure the name of `tgz` file in `package.json` matches the `tgz` file in your repository

Then do `npm install` it will install the library in your new project

## Structure of SSE API

It is expected your structure of SSE API to be <br/>

```
{
    "chunk": "{{anytype here}}",
    "type": "{{ChunkTypes}}"
}

```

You can get more info on ChunkTypes from `ai-assistant/projects/ai-assistant/src/lib/types/chunk-response.types.ts`