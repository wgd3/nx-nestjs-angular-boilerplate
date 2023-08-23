---
title: Frontend Design and Architecture
---

# Frontend Design and Architecture

The frontend in thie repository was established using dynamic module federation in order to support an arbitrary number of additional client applications. It also means that multiple frameworks (React, Vue, etc) can be used in tandem with Angular.

## Scaffolding

```sh
> nx generate @nx/angular:host --name=shell \
--remotes=login,admin \
--addTailwind=true \
--backendProject=server \
--dynamic=true \
--standalone=true \
--tags=type:app,scope:frontend,framework:angular
```
