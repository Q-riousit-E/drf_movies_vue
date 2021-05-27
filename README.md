# Movie Talk (Frontend)
> A movie review site
- Frontend: Vue 3
- Backend: Django REST Framework

## Main Features
- Interactive 3D landing page (three js)
- Seach with instant feedback from db
- 3-way review system: star-rating + hexa-rating + comments

## Frontend Setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

## Backend Setup
> clone this repo [drf_movies](https://github.com/Q-riousit-E/drf_movies)

### Setup
```
# venv
python -m venv venv
source venv/scripts/activate
python -m pip install -r requirements.txt

# django
python manage.py migrate
python manage.py loaddata db.json
```

### Run Server
```
python manage.py runserver
```

## Asset Source
### 3D Model
- [Among us](https://www.cgtrader.com/free-3d-models/character/sci-fi/among-us-character-cb3e5b58-f246-4e71-a3e1-0991935eb60f)
- [pokemon]"Rayquaza #384" (https://skfb.ly/6uYCH) by Jonathon.Lai is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
- [sniper rifle](https://sketchfab.com/3d-models/sci-fi-sniper-rifle-free-2d1bef3aa9ae47c5aee26cc3f032ab31)

### Cursor
- [codepen](https://codepen.io/theseventh/pen/LYVqMYb)

### Star Rater
- [rater-js](https://github.com/fredolss/rater-js)

### Graphs
- [ZingChart](https://www.zingchart.com/)

## Thoughts
### Importance of timing when using Vue

[**Encountered problems**]
- using `store.dispatch` to trigger an action which then requests information from backend that takes time -> causes methods that require such requests to be finished for correct execution to fail. ex). action mutates store.state

[**Solutions**]
1. using `setTimeout()` 
    - easiest to implement but hard to time right
    - could cause problems later on
2. sending request directly not from store
    - chain `.then` to execute after fetch is complete
3. using promises [vue docs](https://vuex.vuejs.org/guide/actions.html#dispatching-actions)
    ```js
    // vuex
    actions: {
    actionA ({ commit }) {
        return new Promise((resolve, reject) => {
        setTimeout(() => {
            commit('someMutation')
            resolve()
        }, 1000)
        })
    },
    actionB ({ dispatch, commit }) {
        return dispatch('actionA').then(() => {
        commit('someOtherMutation')
        })
    }
    }

    //vue
    store.dispatch('actionA').then(() => {
    // ...
    })
    ```

4. using async/await
    ```js
    // assuming `getData()` and `getOtherData()` return Promises

    actions: {
    async actionA ({ commit }) {
        commit('gotData', await getData())
    },
    async actionB ({ dispatch, commit }) {
        await dispatch('actionA') // wait for `actionA` to finish
        commit('gotOtherData', await getOtherData())
    }
    }
    ```

### Vue transitions
[**Encountered problems**]
- using <transition-group> with idx as keys
- -> if elements are pushed into the front of the target Array
- -> keys are no longer unique and thus stop being detected for transitions

[**solutions**]
- use id of list elements for keys so they are always unique