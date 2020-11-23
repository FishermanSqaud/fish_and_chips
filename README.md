# Project Fish and Chips
This is the project composed with entire application system - chrome web extension, proxy, api server, database - with docker.

## Motivation
1. Make the web environment secure
2. Prevent Fishing/Smishing/Spam Sites victims

## Features
- Notify the secure rate of currently visiting website
- Intuitive and friendly UI.
- Sign Up/Sign in

## Usage
Make Sure you have ```.env```

### Requirements
1. [Node.js](https://nodejs.org/ko/download/)
2. [MySQL](https://dev.mysql.com/downloads/)
3. [Docker](https://www.docker.com/products/docker-desktop)
4. [Docker Compose](https://docs.docker.com/compose/install/)

### Run in Docker compose
```
docker-compose up -d --build
```

### Clean up in Docker compose
```
docker-compose down
```

### For native process
1. API Server
  ```
  npm start
  ```

2. Database MySQL
Dependent on host machine process


## Installation
- Need to load Web-extension codes into [chrome extension managment page](chrome://extensions/)
  
  [Chrome official document](https://developer.chrome.com/extensions/getstarted)
  
- ```npm install``` as ```Node.js``` used in [API Server](https://github.com/FishermanSqaud/fish_and_chips/tree/main/api_server) and future React page

## Server 
> IP : 	3.35.127.235 <br>

- CI/CD 정보 :
  미정
  
- 서버 구성도 :
  1. 서버 구조
  ![Screen Shot 2020-11-23 at 2 53 52 PM](https://user-images.githubusercontent.com/48001093/99932546-bc769180-2d9b-11eb-8cdc-eb80e1f9ae53.png)

  
- API docs 현재 미사용

## Authors

- [김예찬](https://github.com/LukeKim32)
- [이희준](https://github.com/lheejn)
- [송민철](https://github.com/cs20081607)
