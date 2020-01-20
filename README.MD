# Sentiment Analyzer
Api for analyze sentiment of the "HackerNews" comments story . 
This API will search through the top stories of "HackerNews" by a phrase and returns the sentiments
Positive, Negative and Neutral of the whole comments. 

We are using HackerNews api (https://github.com/HackerNews/API) for the data 
and Sentiment (https://github.com/thisandagain/sentiment) for the analyzing of sentiment score.

Our score is based on this calculation: 
Positive > 0.1
Negative < -0.1
-0.1 <=Neutral <= 0.1
### Prerequisites
You should have Node installed on your local machine.

### Installing
please run 
```
npm install
```
This will install all the depedencies of the project including Express,Sentiment api.


## Deployment
```
node index
```

## Usage 
Please go to your browser and type: 
```
http://localhost:3000/api/sentiment?phrase=<your phrase to search>

```
## Examples 
```
http://localhost:3000/api/sentiment?phrase=Material
```

Good luck! :) 
