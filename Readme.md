#### `Please follow this file for run this project.`

---

1. **For install dependencies use these commands:**

```bash
nvm install
nvm use
npm install
```

---

2. **For development follow**

```bash
npm run dev
```

---

3. **For production follow**

```bash
npm run build
npm start
```

---

4. **For Postman collection import this url into postman**
   `https://api.postman.com/collections/15666811-38cfc16d-cf75-4927-829d-251a57fbc3cb?access_key=PMAT-01HNYZZHCDBRTHGBAMVSQKY6Z9`

---

##### * D-D-D Architecture is followed  because of

1. It is easy to understand.
2. Scalable for future update because easy to handle versioning.
3. Provide flexibility to follow nuclear terminology.

---

**Things that is done.**

* [X] Create ,Read and Update  operation for user.
* [X] User authentication.
* [X] Product, Feedback and order's Create ,Read and Update operations.
* [X] Used Api payload validation using Joi.
* [X] Error handler also implemented
* [X] Response handler with logger is implemented
* [X] Handle large data using pagination.
* [X] Add all the required filter as per user need.

---

Folder structure :-
    - src
        - modules
            - feedback
            - order
            - product
            - user
                - infra
                    - controller
                        - v1
                        - v2
                            controller.ts
                            index.ts   # has routes
                - interface
                - services
                - validators
        - setup  ## All the setup required things to be here.
            - mongodb
                - connection.ts
            - config
        - shared
            - core
                - constants
                - interfaces
                - types
                - utils ## common method 
                    - custom errors
            - infra 
                - ## db models and repository will be there according to database    
            
                 