## Career Sphere 
User Friendly Career Platform that connects job seekers and employers through features like personalized job recommendations, dynamic search tools, and real-time communication. Job seekers can manage profiles, apply for jobs, and showcase skills, while employers can post listings, evaluate candidates, and host live quizzes. With forums, messaging, and interview scheduling, the platform fosters collaboration and efficient hiring processes.

## Team Members

| Name  | GitHub Username | Email |
| ------------- | ------------- |:-------------:|
|Sudipta Dip| sudipta2621 | dips@myumanitoba.ca
|Sukhmeet Singh Hora| sukhmeet468 | horass@myumanitoba.ca
|Colin McDonell| ColinMcD6 | mcdonelc@myumanitoba.ca
|Ethan Lapkin| EthanLapkin | lapkine@myumanitoba.ca
|AJ Manigque| ThreshvsGaming | manigqua@myumanitoba.ca
|Bryce Erichsen| Bry-er | erichseb@myumanitoba.ca

### Career Sphere Proposal

* [Proposal](https://github.com/ColinMcD6/CareerSphere/wiki/Project-Proposal)

### Architecture Diagram

* [Architecture_Diagram](https://github.com/ColinMcD6/CareerSphere/blob/main/documentation/COMP4350_CareerSphere_ArchitechtureDiagram.png)
 
### Running Application
1. Run the command npm install on the root of the project and then follow the backend and frontend instructions below.

##### Backend
1. Add ```.env``` file to backend folder with the following values populated:
```
NODE_ENV=development
# frontend url
APP_ORIGIN=http://localhost:{FRONTEND PORT}
MONGO_URI=mongodb://localhost:27017/{DB_NAME}
PORT={BACKEND PORT}
JWT_SECRET=myjwtsecret
JWTREFRESH_SECRET=myjwtrefrestsecret
SENDER_EMAIL=aa
API_RESEND=bb
RESEND_API_KEY=re_aQLEGtYG_3TXkr9ds9eYB473GMZjgU7Uj
```
2. From ```backend``` directory run ```npm install```
3. To run application in development mode (every change to file will update server): ```npm run dev```
4. To run application in production mode: ```npm build; npm run start```

##### Frontend
1. Add ```.env``` file to frontend folder with the following values populated: ```VITE_API_URL=http://localhost:{BACKEND PORT}```
2. From ```backend``` directory run ```npm install```
3. To run application: ```npm run dev```

### MongoDB 
1. Install MongoDB and start the service before running the app.
    1. Refer to this https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/ for steps. 
    2. I used the command: brew services stop mongodb-community@8.0 to start on Mac
2. Can also install MongoDB Compass to visualize the database created.